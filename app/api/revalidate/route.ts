import { revalidate } from 'lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const result = await revalidate(req);
  return NextResponse.json(result);
}
