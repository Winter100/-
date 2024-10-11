import { NextResponse } from 'next/server';

import { nexonInstance } from '@/app/_services/nexonInstance';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ocid = searchParams.get('ocid');

  if (!ocid) {
    return NextResponse.json({ error: 'ocid가 없습니다.' }, { status: 400 });
  }

  try {
    const response = await nexonInstance.get(`/character/basic?ocid=${ocid}`);

    const data = await response.data;

    return NextResponse.json(data);
  } catch (e) {}
}
