// import { NextRequest, NextResponse } from 'next/server'
// import { PRODUCTS } from '@/constants/Products'
// import type { Product } from '@/types/types'

// const cart: Product[] = []

// export async function GET() {
//   return NextResponse.json(cart)
// }

// export async function POST(request: NextRequest) {
//   const { productId } = await request.json()

//   const product = PRODUCTS.find(p => p.id === productId)

//   if (!product) {
//     return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
//   }

//   cart.push(product)
//   return NextResponse.json({ message: 'Producto agregado al carrito', cart })
// }


// import { NextRequest, NextResponse } from 'next/server'
// import { PRODUCTS } from '@/constants/Products'
// import type { Product } from '@/types/types'

// // ⚠️ IMPORTANTE: Esto se reinicia cada vez que reinicias el servidor
// const cart: Product[] = []

// export async function GET() {
//   return NextResponse.json(cart)
// }

// export async function POST(request: NextRequest) {
//   const { productId } = await request.json()

//   const product = PRODUCTS.find(p => p.id === productId)

//   if (!product) {
//     return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
//   }

//   // Agregar al carrito sin duplicados
//   if (!cart.some(p => p.id === product.id)) {
//     cart.push(product)
//   }

//   return NextResponse.json(cart)
// }


import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/constants/Products'
import type { Product } from '@/types/types'

// Usamos un Map para almacenar carritos por sesión
const sessionCarts = new Map<string, Product[]>()

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get('sessionId')?.value || Math.random().toString(36).substring(2)
  
  if (!sessionCarts.has(sessionId)) {
    sessionCarts.set(sessionId, [])
  }
  
  const response = NextResponse.json(sessionCarts.get(sessionId))
  
  // Establece cookie si no existe
  if (!request.cookies.get('sessionId')) {
    response.cookies.set('sessionId', sessionId)
  }
  
  return response
}

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get('sessionId')?.value || Math.random().toString(36).substring(2)
  const { productId } = await request.json()

  const product = PRODUCTS.find(p => p.id === productId)
  if (!product) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }

  if (!sessionCarts.has(sessionId)) {
    sessionCarts.set(sessionId, [])
  }

  const cart = sessionCarts.get(sessionId)!
  cart.push({...product}) // Clonamos el producto
  
  const response = NextResponse.json(cart)
  response.cookies.set('sessionId', sessionId)
  return response
}

export async function DELETE(request: NextRequest) {
  const sessionId = request.cookies.get('sessionId')?.value
  if (sessionId && sessionCarts.has(sessionId)) {
    sessionCarts.set(sessionId, [])
  }
  return NextResponse.json([])
}