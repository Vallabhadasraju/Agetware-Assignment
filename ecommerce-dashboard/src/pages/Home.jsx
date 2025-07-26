import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import '../styles/Home.css';

const Home = () => {
  const { products } = useProducts();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Update categories when products change
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    setCategories(uniqueCategories);
  }, [products]);

  // Filter and sort logic
  let filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (category ? p.category === category : true)
  );
  
  if (sort === 'price-asc') filtered = filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered = filtered.sort((a, b) => b.price - a.price);
  if (sort === 'rating-desc') filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sort === 'rating-asc') filtered = filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));

  // Calculate statistics
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const averagePrice = products.length > 0 
    ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)
    : 0;

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleCreateProduct = () => {
    navigate('/create');
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-heading">Discover Amazing Products</h1>
          <p className="home-subtitle">
            Explore our curated collection of high-quality products at unbeatable prices
          </p>
          
          {/* Statistics */}
          <div className="home-stats">
            <div className="stat-item">
              <span className="stat-number">{totalProducts}</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{totalCategories}</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">${averagePrice}</span>
              <span className="stat-label">Avg Price</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="home-content">
        {/* Filters Section */}
        <div className="home-filters">
          <div className="filters-header">
            <h2 className="filters-title">Browse Products</h2>
            <button className="create-product-btn" onClick={handleCreateProduct}>
              + Create Product
            </button>
          </div>
          
          <div className="filters-row">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            
            <select
              value={category}
              onChange={handleCategoryChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select
              value={sort}
              onChange={handleSortChange}
              className="filter-select"
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : filtered.length > 0 ? (
          <div className="home-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <div className="no-products-icon">📦</div>
            <h3 className="no-products-title">
              {search || category ? 'No products found' : 'No products yet'}
            </h3>
            <p className="no-products-text">
              {search || category 
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to add a product to our collection!'
              }
            </p>
            {!search && !category && (
              <button className="create-product-btn" onClick={handleCreateProduct}>
                Create Your First Product
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
