import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductImage } from './imageUtils';
import './LimitedEditionPage.css';

const LimitedEditionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLimitedEditionProducts();
  }, []);

  const fetchLimitedEditionProducts = async () => {
    try {
      const response = await fetch('/api/products/category/Limited Edition');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        console.error('Failed to fetch limited edition products');
      }
    } catch (error) {
      console.error('Error fetching limited edition products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading limited edition products...</div>;
  }

  return (
    <div className="limited-edition-page-container">
      <div className="limited-edition-page-header">
        <h1>Limited Edition Collection</h1>
        <p>Exclusive, rare, and special edition merchandise for true collectors</p>
      </div>
      
      <div className="product-grid">
        {products.map((product) => (
          <Link 
            to={`/product/${product.numericId}?category=${encodeURIComponent(product.Category)}`} 
            key={product.numericId} 
            className="product-card limited-edition-card"
          >
            <div className="product-image-container">
              <img 
                src={getProductImage(product.Category, product.numericId)} 
                alt={product.ProductName} 
                className="product-image" 
              />
              <div className="limited-edition-badge">LIMITED EDITION</div>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.ProductName}</h3>
              <p className="product-price">{product.Price}</p>
              <div className="product-details">
                <span className="product-category">{product.Category}</span>
                {product.gender && <span className="product-gender">{product.gender}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LimitedEditionPage;