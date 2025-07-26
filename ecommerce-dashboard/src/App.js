// src/App.js

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateProduct from './pages/CreateProduct'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import { CartContextProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'

function App() {
  return (
    <ProductProvider>
      <CartContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateProduct />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Router>
      </CartContextProvider>
    </ProductProvider>
  )
}

export default App
