import { NextRequest, NextResponse } from 'next/server';
import { getAds } from '@/lib/tapaz';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const first = Math.min(Number(searchParams.get('first') ?? 36), 100);
  const after = searchParams.get('after') ?? null;

  const page = await getAds(first, after);
  return NextResponse.json(page);
}
