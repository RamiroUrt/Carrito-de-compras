import type { Product } from '@/types/types'

export function findBestCombination(products: Product[], budget: number): Product[] {
  // Ordenamos los productos por precio descendente para priorizar productos más caros primero
  const sortedProducts = [...products].sort((a, b) => b.price - a.price)
  
  let bestCombination: Product[] = []
  let bestSum = 0

  // Función recursiva para encontrar combinaciones
  const backtrack = (startIndex: number, currentCombination: Product[], currentSum: number) => {
    // Si encontramos una combinación exacta, la retornamos inmediatamente
    if (currentSum === budget) {
      bestCombination = [...currentCombination]
      bestSum = currentSum
      return true // Terminamos la búsqueda
    }

    // Si nos pasamos del presupuesto, descartamos esta rama
    if (currentSum > budget) {
      return false
    }

    // Si la suma actual + el producto más barato supera el presupuesto, no seguimos
    const minPrice = Math.min(...sortedProducts.slice(startIndex).map(p => p.price))
    if (currentSum + minPrice > budget) {
      // Verificamos si esta combinación es mejor que la que tenemos
      if (currentSum > bestSum) {
        bestCombination = [...currentCombination]
        bestSum = currentSum
      }
      return false
    }

    // Probamos con los productos restantes
    for (let i = startIndex; i < sortedProducts.length; i++) {
      const product = sortedProducts[i]
      
      // Saltamos productos que ya nos harían pasarnos del presupuesto
      if (currentSum + product.price > budget) continue

      currentCombination.push(product)
      const foundExact = backtrack(i + 1, currentCombination, currentSum + product.price)
      currentCombination.pop()

      if (foundExact) return true
    }

    return false
  }

  backtrack(0, [], 0)

  // Si no encontramos una combinación exacta, devolvemos la mejor aproximación por debajo
  return bestCombination
}