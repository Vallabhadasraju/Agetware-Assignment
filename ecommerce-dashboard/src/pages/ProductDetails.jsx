import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try to find the product in our local products (for newly created products)
        const localProduct = products.find(p => p.id.toString() === id);
        
        if (localProduct) {
          setProduct(localProduct);
        } else {
          // If not found locally, try to fetch from API
          try {
            const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
            setProduct(response.data);
          } catch (error) {
            throw new Error('Product not found');
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, products]);

  const handleAddToCart = () => {
    addToCart(product);
    // Show a brief success message (you could add a toast notification here)
    alert('Product added to cart!');
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Product Not Found</h2>
          <p className="error-text">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <Link to="/" className="product-details-btn">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2 className="error-title">Product Not Available</h2>
          <p className="error-text">
            This product is currently not available.
          </p>
          <Link to="/" className="product-details-btn">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const rating = typeof product.rating === 'object' ? product.rating.rate : product.rating;
  const reviewCount = typeof product.rating === 'object' ? product.rating.count : 0;

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <div className="product-details-header">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
        </div>

        <div className="product-details-content">
          <div className="product-image-section">
            <img 
              src={product.image} 
              alt={product.title} 
              className="product-details-img"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
              }}
            />
          </div>

          <div className="product-info-section">
            <h1 className="product-details-title">{product.title}</h1>
            
            <div className="product-category">
              {product.category}
            </div>

            <div className="product-details-price">
              ₹ {Math.round(product.price * 80)}
            </div>

            <div className="product-rating">
              <div className="rating-stars">
                {[...Array(5)].map((_, index) => (
                  <span 
                    key={index} 
                    className="star"
                    style={{ 
                      color: index < Math.round(rating || 0) ? '#ffd700' : '#ddd' 
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div>
                <div className="rating-text">
                  {rating ? `${rating}/5` : 'No rating'}
                </div>
                {reviewCount > 0 && (
                  <div className="reviews-count">
                    ({reviewCount} reviews)
                  </div>
                )}
              </div>
            </div>

            <p className="product-details-desc">
              {product.description}
            </p>

            <div className="product-actions">
              <button
                onClick={handleAddToCart}
                className="product-details-btn"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="product-details-btn secondary-btn"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
