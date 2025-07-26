import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartContext } from '../context/CartContext'
import '../styles/Header.css';

const Header = () => {
  const { cart } = useCart();

  return (
    <header className="flex justify-between p-4 bg-blue-600 text-white">
      <Link to="/" className="font-bold text-xl">ShopEase</Link>
      <nav className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cart.length})</Link>
      </nav>
    </header>
  );
};

export default Header;
