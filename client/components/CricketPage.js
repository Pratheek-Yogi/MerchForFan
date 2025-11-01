import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductImage } from './imageUtils';
import API_URL from '../config/apiConfig';
import './CricketPage.css';

const CricketPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCricketProducts();
  }, []);

  const fetchCricketProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products/category/Cricket`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        console.error('Failed to fetch cricket products');
      }
    } catch (error) {
      console.error('Error fetching cricket products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading cricket products...</div>;
  }

  return (
    <div className="cricket-page-container">
      <div className="cricket-page-header">
        <h1>Cricket Merchandise</h1>
        <p>Official jerseys, fanwear, and accessories for every cricket enthusiast.</p>
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

export default CricketPage;
