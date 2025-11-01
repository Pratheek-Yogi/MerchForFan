import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductImage } from './imageUtils';
import API_URL from '../config/apiConfig';
import './KidsPage.css';

const KidsPage = () => {
    const [kidsProducts, setKidsProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchKidsProducts();
    }, []);

    const fetchKidsProducts = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch(`${API_URL}/products/search/kid`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch kids products');
            }
            
            const data = await response.json();
            
            if (data.success) {
                setKidsProducts(data.data);
            } else {
                throw new Error(data.message || 'Failed to load kids products');
            }
        } catch (error) {
            console.error('Error fetching kids products:', error);
            setError('Failed to load kids products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="kids-page">
                <div className="kids-container">
                    <div className="loading">Loading kids products...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="kids-page">
                <div className="kids-container">
                    <div className="error-message">
                        <i className="fas fa-exclamation-triangle"></i>
                        <h3>Oops! Something went wrong</h3>
                        <p>{error}</p>
                        <button onClick={fetchKidsProducts} className="retry-btn">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="search-page-container">
            <h1>Kids Collection</h1>
            
            <div className="kids-controls">
                <div className="results-info">
                    <p>Showing all {kidsProducts.length} products</p>
                </div>
            </div>

            {kidsProducts.length === 0 ? (
                <div className="no-products-found">
                    <i className="fas fa-child"></i>
                    <h3>No kids products available</h3>
                    <p>Check back later for new arrivals</p>
                </div>
            ) : (
                <div className="product-grid">
                    {kidsProducts.map((product) => (
                        <Link 
                            to={`/product/${product.numericId}?category=${encodeURIComponent(product.Category)}`} 
                            key={product.numericId} 
                            className="product-card"
                        >
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
            )}
        </div>
    );
};

export default KidsPage;
