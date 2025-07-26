import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products').then((res) => {
      setProducts(res.data);
    });
  }, []);

  const addProduct = (product) => {
    setProducts(prev => [
      { ...product, id: Date.now(), rating: product.rating || 0 },
      ...prev
    ]);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
}; 