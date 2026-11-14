import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getProductsCollection } from '../../../../lib/db';
import { isAdminRequest } from '../../../../lib/auth';
import { validateProduct } from '../../../../lib/product';

export const runtime = 'nodejs';
export async function PUT(request, context) {
  const { id } = await context.params;
  if (!isAdminRequest(request)) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  try {
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid product ID.' }, { status: 400 });
    const body = await request.json();
    const product = validateProduct(body);
    const collection = await getProductsCollection();
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...product, updatedAt: new Date() } });
    if (!result.matchedCount) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not update product.' }, { status: 400 });
  }
}
export async function DELETE(request, context) {
  const { id } = await context.params;
  if (!isAdminRequest(request)) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  try {
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid product ID.' }, { status: 400 });
    const collection = await getProductsCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Could not delete product.' }, { status: 500 });
  }
}
