import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductImage } from './imageUtils';
import API_URL from '../config/apiConfig';
import './SpecialCollectionPage.css';

const SpecialCollectionPage = () => {
  const { sport } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    fetchSpecialCollectionProducts();
  }, [sport]);

  const fetchSpecialCollectionProducts = async () => {
    try {
      setLoading(true);
      // Convert URL parameter to proper sport name
      const sportMap = {
        'cricket': 'Cricket',
        'football': 'Football', 
        'basketball': 'Basketball',
        'motorsport': 'Motorsport'
      };
      
      const sportName = sportMap[sport] || sport;
      setCategoryName(sportName);

      // Fetch from Limited Collection category with specific Sport
      const response = await fetch(`${API_URL}/products/limited-collection/${sportName}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        console.error('Failed to fetch special collection products');
      }
    } catch (error) {
      console.error('Error fetching special collection products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading {sport} special collection...</div>;
  }

  return (
    <div className="special-collection-page-container">
      <div className="special-collection-header">
        <h1>Special {categoryName} Collection</h1>
        <p>Exclusive and premium {categoryName ? categoryName.toLowerCase() : ''} merchandise curated for true fans</p>
      </div>
      
      <div className="product-grid">
        {products.map((product) => (
          <Link 
            to={`/product/${product.numericId}?category=${encodeURIComponent(product.Category)}`} 
            key={product.numericId} 
            className="product-card special-collection-card"
          >
            <div className="product-image-container">
              <img 
                src={getProductImage(product.Category, product.numericId)} 
                alt={product.ProductName} 
                className="product-image" 
              />
              <div className="special-collection-badge">SPECIAL</div>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.ProductName}</h3>
              <p className="product-price">{product.Price}</p>
              <div className="product-details">
                <span className="product-sport">{product.Sport}</span>
                <span className="product-category">{product.Category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-products">
          <p>No products found in the {categoryName} special collection.</p>
        </div>
      )}
    </div>
  );
};

export default SpecialCollectionPage;
