import { NextResponse } from 'next/server'
import { PRODUCTS } from '@/constants/Products'

export async function GET() {
  return NextResponse.json(PRODUCTS)
}
