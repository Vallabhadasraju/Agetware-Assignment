import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => (
  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div className="product-card" style={{ cursor: 'pointer' }}>
      <img src={product.image} alt={product.title} className="h-40 mx-auto object-contain" />
      <h2 className="mt-2 text-sm font-medium">{product.title.slice(0, 50)}...</h2>
      <p style={{ color: '#0072ff', fontWeight: 500, fontSize: '0.95rem', margin: '4px 0' }}>{product.category}</p>
      <p style={{ fontSize: '0.95rem', margin: '4px 0' }}>
        Rating: {typeof product.rating === 'object' ? product.rating.rate : product.rating || 'N/A'}
        <span style={{ color: '#ffb400', marginLeft: 4 }}>
          {'★'.repeat(Math.round(typeof product.rating === 'object' ? product.rating.rate : product.rating || 0))}
        </span>
      </p>
      <p className="text-lg font-bold">₹ {Math.round(product.price * 80)}</p>
    </div>
  </Link>
);

export default ProductCard;
