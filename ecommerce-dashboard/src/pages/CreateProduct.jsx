import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import '../styles/CreateProduct.css';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
    rating: 0
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();
  const { addProduct } = useProducts();

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Beauty',
    'Toys',
    'Automotive',
    'Health',
    'Food & Beverages',
    'Watch'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRatingChange = (newRating) => {
    setFormData(prev => ({
      ...prev,
      rating: newRating
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addProduct({
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating)
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image preview effect
  useEffect(() => {
    if (formData.image && isValidUrl(formData.image)) {
      setImagePreview(formData.image);
    } else {
      setImagePreview('');
    }
  }, [formData.image]);

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span
          key={index}
          className={`star ${formData.rating >= starValue ? 'filled' : ''}`}
          onClick={() => handleRatingChange(starValue)}
          onMouseEnter={() => {
            if (formData.rating === 0) {
              // Only show hover effect if no rating is selected
            }
          }}
        >
          ★
        </span>
      );
    });
  };

  return (
    <div className="create-product-container">
      <div className="create-product-card">
        <div className="create-product-header">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
          <h1 className="create-product-title">Create New Product</h1>
          <p className="create-product-subtitle">
            Add a new product to your inventory with all the details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="create-product-form">
          <div className="form-group">
            <label className="form-label">Product Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter product title..."
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
            />
            {errors.title && (
              <div className="form-error">
                ⚠️ {errors.title}
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input"
                step="0.01"
                min="0"
              />
              {errors.price && (
                <div className="form-error">
                  ⚠️ {errors.price}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="form-error">
                  ⚠️ {errors.category}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleInputChange}
              className="form-input"
            />
            {errors.image && (
              <div className="form-error">
                ⚠️ {errors.image}
              </div>
            )}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" onError={() => setImagePreview('')} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Rating</label>
            <div className="rating-input">
              <div className="rating-stars">
                {renderStars()}
              </div>
              <span style={{ marginLeft: '1rem', color: '#666' }}>
                {formData.rating > 0 ? `${formData.rating}/5 stars` : 'Click to rate'}
              </span>
            </div>
            {errors.rating && (
              <div className="form-error">
                ⚠️ {errors.rating}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              placeholder="Describe your product in detail..."
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              rows="4"
            />
            {errors.description && (
              <div className="form-error">
                ⚠️ {errors.description}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`form-submit-btn ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Product...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct; 