import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductImage } from './imageUtils';
import './CricketPage.css';

const FootballPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFootballProducts();
  }, []);

  const fetchFootballProducts = async () => {
    try {
      const response = await fetch('/api/products/category/Football');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        console.error('Failed to fetch football products');
      }
    } catch (error) {
      console.error('Error fetching football products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading football products...</div>;
  }

  return (
    <div className="cricket-page-container">
      <div className="cricket-page-header">
        <h1>Football Merchandise</h1>
        <p>Official kits, fanwear, and accessories for every football fan.</p>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <Link to={`/product/${product.numericId}?category=${encodeURIComponent(product.Category)}`} key={product.numericId} className="product-card">
            <div className="product-image-container">
              <img 
                src={getProductImage(product.Category, product.numericId)} 
                alt={product.ProductName} 
                className="product-image" 
              />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.ProductName}</h3>
              <p className="product-price">{product.Price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FootballPage;