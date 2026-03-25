import { NextRequest, NextResponse } from 'next/server';
import { getAdDetail } from '@/lib/tapaz';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const legacyId = Number(id);
  if (!Number.isFinite(legacyId) || legacyId <= 0) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const detail = await getAdDetail(legacyId);
  return NextResponse.json(detail);
}
