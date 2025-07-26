import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';

const Cart = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();

  const total = getCartTotal();

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">Your Shopping Cart</h2>
        <Link to="/" className="back-link">
          ← Continue Shopping
        </Link>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3 className="empty-cart-title">Your cart is empty</h3>
          <p className="empty-cart-text">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹ {Math.round(total * 80)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹ {Math.round(total * 80)}</span>
            </div>
            
            <div className="cart-actions">
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
              <button 
                className="clear-cart-btn"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
