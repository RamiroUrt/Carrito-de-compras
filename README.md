# 🛒 Prueba Técnica - HoyTrabajas

Este proyecto consiste en una aplicación fullstack que permite gestionar un listado de productos, agregar productos a un carrito de compras y encontrar la mejor combinación de productos según un presupuesto determinado.

## 📌 Tecnologías utilizadas

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **API Routes (sin base de datos)**

---

## 🚀 Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/RamiroUrt/Carrito-de-compras.git
cd Carrito-de-compras

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

La app estará disponible en: http://localhost:3000

```
##🧩 Funcionalidades
✅ Backend (API)
GET /api/products: Devuelve una lista estática de productos.

POST /api/cart: Agrega un producto al carrito (en memoria).

GET /api/cart: Devuelve los productos agregados al carrito.

##✅ Frontend
Visualización de productos con imagen, nombre y precio.

Botón "Agregar al carrito" para cada producto.

Vista de los productos añadidos al carrito.

Función que permite calcular la mejor combinación de productos sin exceder un presupuesto fijo.

Botón para refrescar la combinación aleatoriamente.

##🧠 Lógica de combinación
Se implementó una función findBestCombination(products, budget) que:

Encuentra todas las combinaciones posibles sin superar el presupuesto.

Retorna una combinación aleatoria válida cada vez que se solicita.
