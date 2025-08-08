import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/constants/Products'
import type { Product } from '@/types/types'

// Usamos un Map en memoria para simular carritos por sesión.
const sessionCarts = new Map<string, Product[]>()

export async function GET(request: NextRequest) {
  // Intentamos obtener el ID de sesión desde las cookies.
  // Si no existe, generamos uno nuevo.
  const sessionId = request.cookies.get('sessionId')?.value || Math.random().toString(36).substring(2)
  
  // Si la sesión no tiene carrito aún, lo inicializamos vacío.
  if (!sessionCarts.has(sessionId)) {
    sessionCarts.set(sessionId, [])
  }

  const response = NextResponse.json(sessionCarts.get(sessionId))

  // Si no había cookie de sesión, la seteamos para mantener persistencia
  if (!request.cookies.get('sessionId')) {
    response.cookies.set('sessionId', sessionId)
  }

  return response
}

// Esta funcion  agrega un producto al carrito de la sesión actual.
export async function POST(request: NextRequest) {
  // Obtenemos o generamos el ID de sesión.
  const sessionId = request.cookies.get('sessionId')?.value || Math.random().toString(36).substring(2)

  // Leemos el ID del producto enviado en el body.
  const { productId } = await request.json()

  const product = PRODUCTS.find(p => p.id === productId)
  if (!product) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }

  if (!sessionCarts.has(sessionId)) {
    sessionCarts.set(sessionId, [])
  }

  // Agregamos una copia del producto.
  const cart = sessionCarts.get(sessionId)!
  cart.push({ ...product }) // trae la info clonada del carrito

  // Devolvemos el carrito actualizado
  const response = NextResponse.json(cart)
  response.cookies.set('sessionId', sessionId)
  return response
}

// funcion para vaciar el carrito de la sesión actual.
export async function DELETE(request: NextRequest) {
  // Obtenemos el ID de sesión desde la cookie.
  const sessionId = request.cookies.get('sessionId')?.value

  // se inicializa el carrito vacío si no existe.
  if (sessionId && sessionCarts.has(sessionId)) {
    sessionCarts.set(sessionId, [])
  }

  // Respondemos con el carrito vacío.
  return NextResponse.json([])
}
