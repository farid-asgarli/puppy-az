import { NextRequest, NextResponse } from 'next/server';
import { getAdDetail, getAdPhones } from '@/lib/tapaz';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const legacyId = Number(id);
  if (!Number.isFinite(legacyId) || legacyId <= 0) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  // We need the ad path to load the right page for CSRF extraction
  const detail = await getAdDetail(legacyId);
  const phones = await getAdPhones(legacyId, detail.path);
  return NextResponse.json({ phones });
}
