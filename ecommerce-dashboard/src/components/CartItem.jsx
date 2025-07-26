import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.title} />
      </div>
      
      <div className="cart-item-details">
        <h3 className="cart-item-title">{item.title}</h3>
        <p className="cart-item-category">{item.category}</p>
        <p className="cart-item-price">₹ {Math.round(item.price * 80)}</p>
      </div>
      
      <div className="cart-item-quantity">
        <button 
          className="quantity-btn"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="quantity-display">{item.quantity}</span>
        <button 
          className="quantity-btn"
          onClick={() => handleQuantityChange(item.quantity + 1)}
        >
          +
        </button>
      </div>
      
      <div className="cart-item-total">
        <span>₹ {Math.round(item.price * item.quantity * 80)}</span>
      </div>
      
      <button 
        className="remove-btn"
        onClick={handleRemove}
      >
        ×
      </button>
    </div>
  );
};

export default CartItem;
