import { NextRequest, NextResponse } from 'next/server';
import { createPetAd, type CreatePetAdPayload } from '@/lib/puppy-api';

export async function POST(request: NextRequest) {
  const userId = process.env.PUPPY_ADMIN_USER_ID;
  if (!userId) {
    return NextResponse.json({ error: 'PUPPY_ADMIN_USER_ID not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const payload: CreatePetAdPayload = {
      userId,
      title: body.title,
      description: body.description,
      ageInMonths: body.ageInMonths ?? null,
      gender: body.gender ?? null,
      adType: body.adType ?? 1,
      color: body.color ?? '',
      weight: body.weight ?? null,
      size: body.size ?? null,
      price: body.price ?? 0,
      cityId: body.cityId,
      districtId: body.districtId ?? null,
      petBreedId: body.petBreedId ?? null,
      petCategoryId: body.petCategoryId ?? null,
      imageIds: body.imageIds ?? null,
    };

    const result = await createPetAd(payload);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('Import ad error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Import failed' }, { status: 500 });
  }
}
