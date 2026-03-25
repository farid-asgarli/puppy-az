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
# tap.az watermark: semi-transparent white text, always at two fixed positions:
#   • Center: large "tap.az" — search ROI ~30-70% width, 42-58% height
#   • Bottom-right: small "tap.az" — search ROI ~82-100% width, 92-100% height
# We detect the actual bright text pixels within these ROIs so only the
# watermark is masked, never the pet underneath.

# Watermark search regions: (x1%, y1%, x2%, y2%) of image dimensions
_WATERMARK_ROIS = [
    (0.28, 0.42, 0.72, 0.58),   # center — generous search area
    (0.82, 0.92, 1.00, 1.00),   # bottom-right
]


def _detect_text_pixels(roi_gray: np.ndarray) -> np.ndarray:
    """
    Detect semi-transparent white watermark text pixels in a grayscale ROI.
    Returns a binary mask of the same size as the ROI.

    The watermark is brighter than its local background. We compare each pixel
    against a large-kernel median (which smooths out the text) to find pixels
    that are abnormally bright relative to their surroundings.
    """
    rh, rw = roi_gray.shape
    roi_f = roi_gray.astype(np.float32)

    # Local median as background estimate (large kernel to ignore text)
    ksize = max(31, (min(rw, rh) // 4) | 1)
    local_bg = cv2.medianBlur(roi_gray, ksize).astype(np.float32)

    # Watermark = pixels brighter than local background
    # Adaptive threshold: stricter on bright backgrounds (white fur/walls)
    diff = roi_f - local_bg
    bright_bg = local_bg > 180
    thresh = np.where(bright_bg, 14.0, 7.0)
    hits = ((diff > thresh) & (diff < 80)).astype(np.uint8) * 255

    # Morphological cleanup: remove isolated noise pixels
    kernel_open = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    hits = cv2.morphologyEx(hits, cv2.MORPH_OPEN, kernel_open)

    # Find contours & filter tiny blobs
    contours, _ = cv2.findContours(hits, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return np.zeros((rh, rw), dtype=np.uint8)

    min_area = rw * rh * 0.0003
    valid = [c for c in contours if cv2.contourArea(c) >= min_area]
    if not valid:
        return np.zeros((rh, rw), dtype=np.uint8)

    # Cluster by vertical centroid — keep only the dominant text line.
    # "tap.az" is a single horizontal line, so fragments share similar y.
    centroids = []
    for c in valid:
        M = cv2.moments(c)
        if M["m00"] > 0:
            centroids.append((int(M["m01"] / M["m00"]), c))
    if not centroids:
        return np.zeros((rh, rw), dtype=np.uint8)

    ys = np.array([cy for cy, _ in centroids])
    band = max(int(rh * 0.25), 8)
    best_y, best_count = ys[0], 0
    for y_ref in ys:
        count = np.sum(np.abs(ys - y_ref) <= band)
        if count > best_count:
            best_count = count
            best_y = y_ref

    text_contours = [c for cy, c in centroids if abs(cy - best_y) <= band]
    if not text_contours:
        return np.zeros((rh, rw), dtype=np.uint8)

    # Draw filled contours — masks only the text shape, not the full bbox
    result = np.zeros((rh, rw), dtype=np.uint8)
    cv2.drawContours(result, text_contours, -1, 255, -1)

    return result


def build_watermark_mask(img_bgr: np.ndarray, dilate_px: int = 0) -> np.ndarray:
    """
    Detect watermark text pixels within the known fixed ROI positions.
    Only the actual text is masked — the image content underneath is preserved.
    """
    h, w = img_bgr.shape[:2]
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    mask = np.zeros((h, w), dtype=np.uint8)

    for (rx1, ry1, rx2, ry2) in _WATERMARK_ROIS:
        x1 = int(w * rx1)
        y1 = int(h * ry1)
        x2 = min(int(w * rx2), w)
        y2 = min(int(h * ry2), h)
        roi = gray[y1:y2, x1:x2]
        roi_mask = _detect_text_pixels(roi)
        mask[y1:y2, x1:x2] = cv2.bitwise_or(mask[y1:y2, x1:x2], roi_mask)

    if dilate_px > 0:
        kernel = cv2.getStructuringElement(
            cv2.MORPH_ELLIPSE, (dilate_px * 2 + 1, dilate_px * 2 + 1)
        )
        mask = cv2.dilate(mask, kernel)

    return mask


def build_region_masks(img_bgr: np.ndarray, dilate_px: int = 0) -> list[np.ndarray]:
    """
    Return separate masks per watermark region (pixel-level detection).
    Processing regions independently gives LaMa more focused context.
    """
    h, w = img_bgr.shape[:2]
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    masks = []

    for (rx1, ry1, rx2, ry2) in _WATERMARK_ROIS:
        x1 = int(w * rx1)
        y1 = int(h * ry1)
        x2 = min(int(w * rx2), w)
        y2 = min(int(h * ry2), h)
        roi = gray[y1:y2, x1:x2]
        roi_mask = _detect_text_pixels(roi)

        m = np.zeros((h, w), dtype=np.uint8)
        m[y1:y2, x1:x2] = roi_mask
        if dilate_px > 0:
            kernel = cv2.getStructuringElement(
                cv2.MORPH_ELLIPSE, (dilate_px * 2 + 1, dilate_px * 2 + 1)
            )
            m = cv2.dilate(m, kernel)
        masks.append(m)

    return masks


def build_mask_pil(width: int, height: int, padding: int = 8) -> Image.Image:
    """Fixed rectangle mask as PIL Image (L mode) for preview endpoint."""
    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    for (rx1, ry1, rx2, ry2) in _WATERMARK_ROIS:
        x1 = int(width * rx1) - padding
        y1 = int(height * ry1) - padding
        x2 = min(int(width * rx2), width) + padding
        y2 = min(int(height * ry2), height) + padding
        draw.rectangle([x1, y1, x2, y2], fill=255)
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


def inpaint_lama(img_bgr: np.ndarray, device: str = "cuda") -> np.ndarray:
    """LaMa inpainting via iopaint — high-quality GPU-accelerated.
    Detects watermark text pixels and processes each region separately
    with generous crop margins for maximum texture context.

    Args:
        img_bgr: input image in BGR color space
    Returns:
        result in BGR color space
    """
    from iopaint.schema import InpaintRequest, HDStrategy, LDMSampler

    inpainter = get_inpainter(device)

    # Detect text pixels per region, dilate slightly to cover fringes
    region_masks = build_region_masks(img_bgr, dilate_px=5)

    # iopaint expects RGB input, returns BGR — convert between each pass
    result = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

    config = InpaintRequest(
        hd_strategy=HDStrategy.CROP,
        hd_strategy_crop_margin=128,
        hd_strategy_crop_trigger_size=512,
        hd_strategy_resize_limit=2048,
        ldm_steps=20,
        ldm_sampler=LDMSampler.ddim,
    )

    for region_mask in region_masks:
        if np.any(region_mask > 0):
            result_bgr = inpainter(result, region_mask, config)
            # Convert back to RGB for next pass (or final output conversion)
            result = cv2.cvtColor(result_bgr.astype(np.uint8), cv2.COLOR_BGR2RGB)

    # Return BGR for cv2.imwrite compatibility
    return cv2.cvtColor(result, cv2.COLOR_RGB2BGR).astype(np.uint8)


# ── CLI helpers ──────────────────────────────────────────────────────────────

def process_image(image_path: Path, use_lama: bool = False, radius: int = 7,
                  device: str = "cuda") -> tuple[np.ndarray, np.ndarray]:
    """Load image, detect & remove watermark. Returns (result_bgr, mask)."""
    img = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f"Cannot read image: {image_path}")

    if use_lama:
        result = inpaint_lama(img, device=device)
        mask = build_watermark_mask(img, dilate_px=5)
    else:
        mask = build_watermark_mask(img)
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
        img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

        # inpaint_lama takes BGR, returns BGR
        result_bgr = inpaint_lama(img_bgr)
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

                result_bgr = inpaint_lama(img_bgr)
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