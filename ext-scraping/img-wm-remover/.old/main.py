"""
Watermark Remover — CLI + FastAPI server
Optimized for tap.az watermarks: fixed center + bottom-right positions.

Supports two inpainting backends:
  • LaMa (via iopaint) — high-quality, GPU-accelerated (default with --server)
  • OpenCV Telea       — lightweight CPU fallback (default CLI)

Requirements:
    pip install opencv-python pillow numpy              # CLI (opencv fallback)
    pip install iopaint fastapi uvicorn python-multipart # Server (LaMa + CUDA)

CLI usage:
    python main.py image.png                        # LaMa (CUDA) → image_clean.png
    python main.py image.png --opencv               # OpenCV fallback (CPU)
    python main.py image.png --preview-mask         # Save mask overlay for debugging
    python main.py image.png -o output.png          # Custom output path
    python main.py *.png                            # Process multiple files

Server usage:
    python main.py --server                         # Start FastAPI on :8000
    python main.py --server --port 9000             # Custom port
"""

import argparse
import io
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter


# ── Mask generation ─────────────────────────────────────────────────────────

def detect_watermark_mask(img_bgr: np.ndarray) -> np.ndarray:
    """
    Create a mask for the tap.az watermark. Uses a two-pass approach:
    1. Search within a generous ROI for watermark text (deviation from local median)
    2. Mask only detected text pixels + a tight dilation margin

    The tap.az watermark has two parts:
      • Center: "tap.az" text, vertically centered, spans up to ~55% width
      • Bottom-right: smaller "tap.az" label near the corner
    """
    h, w = img_bgr.shape[:2]
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    mask = np.zeros((h, w), dtype=np.uint8)

    def _detect_text_in_roi(roi_u8, dilate_size: int = 9):
        """Detect semi-transparent text overlay pixels in an ROI using
        multiple complementary methods, then combine."""
        rh, rw = roi_u8.shape
        roi_f = roi_u8.astype(np.float32)

        # Method 1: Local deviation from median
        # The watermark text shifts brightness relative to the local area
        ksize = max(31, (min(rw, rh) // 3) | 1)
        local_med = cv2.medianBlur(roi_u8, ksize).astype(np.float32)
        deviation = np.abs(roi_f - local_med)
        dev_mask = ((deviation > 5) & (deviation < 100)).astype(np.uint8) * 255

        # Method 2: Canny edge detection — watermark text creates distinct edges
        blurred = cv2.GaussianBlur(roi_u8, (3, 3), 0)
        edges = cv2.Canny(blurred, 20, 60)

        # Combine both signals
        combined = cv2.bitwise_or(dev_mask, edges)

        # Morphological cleanup
        # Remove isolated noise pixels
        kernel_open = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        combined = cv2.morphologyEx(combined, cv2.MORPH_OPEN, kernel_open)

        # Connect nearby detections and expand to cover full glyph strokes
        kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (dilate_size, dilate_size))
        combined = cv2.morphologyEx(combined, cv2.MORPH_CLOSE, kernel_close)
        combined = cv2.dilate(combined, kernel_close, iterations=1)

        # Filter out very large blobs (likely real image content, not watermark)
        contours, _ = cv2.findContours(combined, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        filtered = np.zeros_like(combined)
        for cnt in contours:
            x, y, bw, bh = cv2.boundingRect(cnt)
            # Skip blobs spanning >80% of ROI in either dimension
            if bw > rw * 0.8 and bh > rh * 0.8:
                continue
            cv2.drawContours(filtered, [cnt], -1, 255, -1)

        return filtered

    # ── Center watermark — wide search region, ~55% width x 12% height ──
    cw = int(w * 0.55)
    ch = int(h * 0.12)
    cx = (w - cw) // 2
    cy = (h - ch) // 2
    center_roi = gray[cy:cy+ch, cx:cx+cw]
    center_detected = _detect_text_in_roi(center_roi, dilate_size=11)

    # If almost nothing detected (<1%), the watermark might be very faint
    # — fill the central text-sized stripe as fallback
    coverage = np.sum(center_detected > 0) / (ch * cw)
    if coverage < 0.01:
        center_detected[:] = 255
    mask[cy:cy+ch, cx:cx+cw] = center_detected

    # ── Bottom-right watermark ──
    bw = int(w * 0.13)
    bh = int(h * 0.06)
    bx = w - bw - max(int(w * 0.005), 2)
    by = h - bh - max(int(h * 0.005), 2)
    br_roi = gray[by:by+bh, bx:bx+bw]
    br_detected = _detect_text_in_roi(br_roi, dilate_size=7)
    br_coverage = np.sum(br_detected > 0) / (bh * bw)
    if br_coverage < 0.01:
        br_detected[:] = 255
    mask[by:by+bh, bx:bx+bw] = cv2.bitwise_or(mask[by:by+bh, bx:bx+bw], br_detected)

    # Final feather for clean blending
    mask = cv2.GaussianBlur(mask, (5, 5), 0)
    _, mask = cv2.threshold(mask, 20, 255, cv2.THRESH_BINARY)

    return mask


def build_mask_pil(width: int, height: int, padding: int = 8) -> Image.Image:
    """Fallback: fixed rectangle mask as PIL Image (L mode) for preview endpoint."""
    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    # Center
    cw, ch = int(width * 0.45), int(height * 0.10)
    cx, cy = (width - cw) // 2, (height - ch) // 2
    draw.rectangle([cx - padding, cy - padding, cx + cw + padding, cy + ch + padding], fill=255)
    # Bottom-right
    bw, bh = int(width * 0.10), int(height * 0.055)
    bx = width - bw - int(width * 0.01)
    by = height - bh - int(height * 0.01)
    draw.rectangle([bx - padding, by - padding, bx + bw + padding, by + bh + padding], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=4))
    mask = mask.point(lambda p: 255 if p > 25 else 0)
    return mask


# ── Inpainting backends ─────────────────────────────────────────────────────

def inpaint_opencv(img_bgr: np.ndarray, mask: np.ndarray, radius: int = 7) -> np.ndarray:
    """OpenCV Telea — fast CPU fallback."""
    return cv2.inpaint(img_bgr, mask, radius, cv2.INPAINT_TELEA)


# ── LaMa (iopaint) backend ──────────────────────────────────────────────────

_inpainter = None

def get_inpainter(device: str = "cuda"):
    global _inpainter
    if _inpainter is None:
        from iopaint.model_manager import ModelManager
        _inpainter = ModelManager(name="lama", device=device)
        print(f"✅ LaMa model loaded on {device.upper()}")
    return _inpainter


def inpaint_lama(img_rgb: np.ndarray, mask: np.ndarray, device: str = "cuda") -> np.ndarray:
    """LaMa inpainting via iopaint — high-quality GPU-accelerated."""
    from iopaint.schema import InpaintRequest, HDStrategy, LDMSampler

    inpainter = get_inpainter(device)
    config = InpaintRequest(
        hd_strategy=HDStrategy.ORIGINAL,
        hd_strategy_crop_margin=32,
        hd_strategy_crop_trigger_size=512,
        hd_strategy_resize_limit=2048,
        ldm_steps=20,
        ldm_sampler=LDMSampler.ddim,
    )
    result = inpainter(img_rgb, mask, config)
    return result.astype(np.uint8)


# ── CLI helpers ──────────────────────────────────────────────────────────────

def process_image(image_path: Path, use_lama: bool = False, radius: int = 7,
                  device: str = "cuda") -> tuple[np.ndarray, np.ndarray]:
    """Load image, detect watermark, run chosen inpainting backend. Returns (result_bgr, mask)."""
    img = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f"Cannot read image: {image_path}")

    mask = detect_watermark_mask(img)

    if use_lama:
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # LaMa.forward() takes RGB, returns BGR
        result = inpaint_lama(img_rgb, mask, device)
    else:
        result = inpaint_opencv(img, mask, radius)

    return result, mask


def save_mask_preview(image_path: Path, mask: np.ndarray, output_path: Path):
    """Save a red-overlay preview showing where the mask covers."""
    img = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    overlay = img.copy()
    overlay[mask > 0] = [0, 0, 255]
    preview = cv2.addWeighted(img, 0.6, overlay, 0.4, 0)
    cv2.imwrite(str(output_path), preview)


# ── FastAPI server ───────────────────────────────────────────────────────────

def create_app():
    from fastapi import FastAPI, File, UploadFile, HTTPException, Query
    from fastapi.responses import StreamingResponse
    from fastapi.middleware.cors import CORSMiddleware

    app = FastAPI(title="Watermark Remover API", version="2.0.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health():
        return {"status": "ok", "model": "lama", "device": "cuda"}

    @app.post("/remove-watermark")
    async def remove_watermark(
        file: UploadFile = File(...),
        return_mask: bool = Query(False, description="Also return mask as base64"),
    ):
        if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
            raise HTTPException(400, f"Unsupported file type: {file.content_type}")

        raw = await file.read()
        image = Image.open(io.BytesIO(raw)).convert("RGB")
        img_np = np.array(image)

        # Detect watermark dynamically, then inpaint
        img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
        mask = detect_watermark_mask(img_bgr)
        # LaMa returns BGR, convert back to RGB for PIL
        result_bgr = inpaint_lama(img_np, mask)
        result_rgb = cv2.cvtColor(result_bgr, cv2.COLOR_BGR2RGB)

        result_img = Image.fromarray(result_rgb)
        buf = io.BytesIO()
        result_img.save(buf, format="PNG", optimize=True)
        buf.seek(0)

        return StreamingResponse(
            buf,
            media_type="image/png",
            headers={"Content-Disposition": "attachment; filename=clean.png"},
        )

    @app.post("/preview-mask")
    async def preview_mask(file: UploadFile = File(...)):
        raw = await file.read()
        image = Image.open(io.BytesIO(raw)).convert("RGBA")
        w, h = image.size

        mask_pil = build_mask_pil(w, h).convert("RGBA")
        overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        red = Image.new("RGBA", (w, h), (255, 0, 0, 120))
        overlay.paste(red, mask=mask_pil.split()[0])
        result = Image.alpha_composite(image, overlay).convert("RGB")

        buf = io.BytesIO()
        result.save(buf, format="PNG")
        buf.seek(0)
        return StreamingResponse(buf, media_type="image/png")

    @app.post("/batch-remove-watermark")
    async def batch_remove(files: list[UploadFile] = File(...)):
        import zipfile

        zip_buf = io.BytesIO()
        with zipfile.ZipFile(zip_buf, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in files:
                raw = await f.read()
                image = Image.open(io.BytesIO(raw)).convert("RGB")
                img_np = np.array(image)
                img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
                mask = detect_watermark_mask(img_bgr)
                result_bgr = inpaint_lama(img_np, mask)
                result_rgb = cv2.cvtColor(result_bgr, cv2.COLOR_BGR2RGB)

                img_buf = io.BytesIO()
                Image.fromarray(result_rgb).save(img_buf, format="PNG")
                zf.writestr(f"clean_{f.filename}", img_buf.getvalue())

        zip_buf.seek(0)
        return StreamingResponse(
            zip_buf,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=cleaned_images.zip"},
        )

    return app


# ── CLI ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Remove tap.az watermarks from images")

    # Mode
    parser.add_argument("images", nargs="*", type=Path, help="Image file(s) to process")
    parser.add_argument("--server", action="store_true", help="Start FastAPI server (LaMa + CUDA)")
    parser.add_argument("--port", type=int, default=8000, help="Server port (default: 8000)")

    # Backend
    parser.add_argument("--opencv", action="store_true", help="Use lightweight OpenCV inpainting instead of LaMa")
    parser.add_argument("--device", default="cuda", help="Device for LaMa: cuda or cpu (default: cuda)")
    parser.add_argument("--radius", type=int, default=7, help="OpenCV inpainting radius (default: 7)")

    # Output
    parser.add_argument("-o", "--output", type=Path, help="Output path (single image mode)")
    parser.add_argument("--preview-mask", action="store_true", help="Save mask overlay for debugging")

    args = parser.parse_args()

    # ── Server mode ──
    if args.server:
        import uvicorn
        app = create_app()
        get_inpainter(args.device)  # pre-load model
        print(f"🚀 Starting server on http://0.0.0.0:{args.port}")
        uvicorn.run(app, host="0.0.0.0", port=args.port)
        return

    # ── CLI mode ──
    if not args.images:
        parser.error("Provide image file(s) or use --server to start the API")

    use_lama = not args.opencv
    backend = "LaMa (CUDA)" if use_lama else "OpenCV"
    print(f"Backend: {backend}")

    for img_path in args.images:
        if not img_path.exists():
            print(f"⚠ Skipping missing file: {img_path}")
            continue

        print(f"Processing: {img_path}")
        result, mask = process_image(img_path, use_lama=use_lama,
                                     radius=args.radius, device=args.device)

        if args.output and len(args.images) == 1:
            out_path = args.output
        else:
            out_path = img_path.with_stem(img_path.stem + "_clean")

        cv2.imwrite(str(out_path), result)
        print(f"  → Saved: {out_path}")

        if args.preview_mask:
            mask_path = img_path.with_stem(img_path.stem + "_mask")
            save_mask_preview(img_path, mask, mask_path)
            print(f"  → Mask preview: {mask_path}")

    print("Done.")


if __name__ == "__main__":
    main()