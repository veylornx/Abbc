import { NextResponse } from 'next/server';
import { getProductsCollection } from '../../../lib/db';
import { isAdminRequest } from '../../../lib/auth';
import { validateProduct } from '../../../lib/product';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const all = request.nextUrl.searchParams.get('all') === '1';
    if (all && !isAdminRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const collection = await getProductsCollection();
    const query = all ? {} : { visible: { $ne: false } };
    const docs = await collection.find(query).sort({ createdAt: -1, _id: 1 }).toArray();
    return NextResponse.json(docs.map(({ _id, ...p }) => ({ id: _id.toString(), ...p })), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('GET products:', error);
    return NextResponse.json({ error: 'Could not connect to the database. Check MONGODB_URI and Atlas network access.' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  try {
    const body = await request.json();
    const product = validateProduct(body);
    const collection = await getProductsCollection();
    const result = await collection.insertOne({ ...product, createdAt: new Date() });
    return NextResponse.json({ id: result.insertedId.toString(), ...product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not save product.' }, { status: 400 });
  }
}

