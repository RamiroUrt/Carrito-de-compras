'use client'

import DecorativeCircle from './components/DecorativeCircle'
import { useEffect, useState } from 'react'
import type { Product } from '@/types/types'
import { findBestCombination } from '@/utils/findBestCombination'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Product[]>([])
  const [bestCombo, setBestCombo] = useState<Product[]>([])
  const [budget, setBudget] = useState<number>() // Estado para el presupuesto

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)

  fetch('/api/cart')
    .then(res => res.json())
    .then(data => {
      // Filtra productos nulos o undefined por si acaso
      setCart(data.filter((item: Product | null) => item !== null))
    })
}, [])

  const addToCart = async (id: number) => {
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id })
    })

    const updatedCart = await fetch('/api/cart').then(res => res.json())
    setCart(updatedCart)
  }

  const calculateCombo = () => {
    if (!budget) {
      alert('Por favor ingresa un presupuesto válido')
      return
    }
    const combo = findBestCombination(products, budget)
    setBestCombo(combo)
  }

const handlePurchase = async () => {
  if (cart.length === 0) {
    alert('El carrito está vacío')
    return
  }

  try {
    // 1. Procesar la compra
    const total = cart.reduce((sum, p) => sum + p.price, 0)
    
    // 2. Limpiar el carrito EN EL BACKEND
    await fetch('/api/cart', {
      method: 'DELETE'
    })

    // 3. Actualizar el estado local
    setCart([])
    
    alert(`Compra realizada por $${total}\n¡Gracias por su compra!`)
  } catch (error) {
    console.error('Error al procesar compra:', error)
    alert('Ocurrió un error al procesar la compra')
  }
}

// Modifica el useEffect para manejar errores
useEffect(() => {
  const loadData = async () => {
    try {
      const [productsRes, cartRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/cart')
      ])
      
      setProducts(await productsRes.json())
      setCart(await cartRes.json())
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
  }
  
  loadData()
}, [])

  const cartTotal = cart.reduce((sum, product) => sum + product.price, 0)

  return (
    <>
      <main className="contain-global">
        <DecorativeCircle color="#fb6a25" size={300} top="5%" left="10%" />
        <DecorativeCircle color="#fb6a25" size={200} top="20%" left="70%"/>
        <DecorativeCircle color="#fb6a25" size={200} top="50%" left="20%"/>
        <DecorativeCircle color="#fb6a25" size={400} top="70%" left="60%"/>
        <DecorativeCircle color="#fb6a25" size={500} top="75%" left="20%"/>
        <DecorativeCircle color="#fb6a25" size={300} top="50%" left="-10%"/>
        <DecorativeCircle color="#fb6a25" size={400} top="-10%" left="85%"/>
        <main className="contain-main">
          <section>
            <h1 className="title">Productos</h1>
            <ul className="box-contain-product">
              {products.map(p => (
                <li key={p.id} className="contain-product">
                  <span className='product-details'>{p.name} - ${p.price}</span>
                  <button
                    className="btn-product"
                    onClick={() => addToCart(p.id)}
                  >
                    Agregar al carrito 🛒
                  </button>
                </li>
              ))}
            </ul>
          </section>
          
          <section className="cart-section">
            <h2 className="title">Carrito</h2>
            <ul className="mb-2">
              {cart.length > 0 ? (
                <>
                  {cart.map((p, idx) => (
                    <li key={idx} className="flex justify-between py-1 border-b">
                      <span>{p.name}</span>
                      <span>${p.price}</span>
                    </li>
                  ))}
                  <li className="flex justify-between py-2 mt-2 font-bold border-t">
                    <span>Total:</span>
                    <span>${cartTotal}</span>
                  </li>
                </>
              ) : (
                <li className="text-gray-500">El carrito está vacío</li>
              )}
            </ul>
            <button
              onClick={handlePurchase}
              disabled={cart.length === 0}
              className={`w-full py-2 px-4 rounded font-bold ${
                cart.length > 0 
                  ? 'btn-product' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Realizar Compra
            </button>
          </section>

          <section>
            <h2 className="title">Mejor combinación</h2>
            <div className="mb-2">
              <label htmlFor="budget" className="block mb-1">Presupuesto:</label>
              <input
                id="budget"
                type="number"
                value={budget || ''}
                placeholder='Ingresa tu presupuesto ej: 150'
                onChange={(e) => setBudget(Number(e.target.value))}
                className="border p-1 rounded w-full"
                min="0"
              />
            </div>
            <button
              className="bg-green-500 text-white px-2 py-1 rounded mb-2 w-full hover:bg-green-600"
              onClick={calculateCombo}
            >
              Calcular combinación 🔁
            </button>
            <ul>
              {bestCombo.length > 0 ? (
                <>
                  {bestCombo.map(p => (
                    <li key={p.id} className="flex justify-between py-1 border-b">
                      <span>{p.name}</span>
                      <span>${p.price}</span>
                    </li>
                  ))}
                  <li className="flex justify-between py-2 mt-2 font-bold border-t">
                    <span>Total:</span>
                    <span>${bestCombo.reduce((sum, p) => sum + p.price, 0)}</span>
                    {bestCombo.reduce((sum, p) => sum + p.price, 0) < (budget || 0) && (
                      <span className="text-orange-500 ml-2">(No se encontró combinación exacta)</span>
                    )}
                  </li>
                </>
              ) : (
                <li className="text-gray-500">
                  {budget ? "No hay combinación posible con este presupuesto" : "Ingresa un presupuesto para calcular"}
                </li>
              )}
            </ul>
          </section>
        </main>
      </main>
    </>
  )
}