import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductImage } from './imageUtils';
import API_URL from '../config/apiConfig';
import './TshirtPage.css';

const TshirtPage = () => {
    const [tshirts, setTshirts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTshirts();
    }, []);

    const fetchTshirts = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch(`${API_URL}/products/search/shirt`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch t-shirts');
            }
            
            const data = await response.json();
            
            if (data.success) {
                setTshirts(data.data);
            } else {
                throw new Error(data.message || 'Failed to load t-shirts');
            }
        } catch (error) {
            console.error('Error fetching t-shirts:', error);
            setError('Failed to load t-shirts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="tshirt-page">
                <div className="tshirt-container">
                    <div className="loading">Loading t-shirts...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tshirt-page">
                <div className="tshirt-container">
                    <div className="error-message">
                        <i className="fas fa-exclamation-triangle"></i>
                        <h3>Oops! Something went wrong</h3>
                        <p>{error}</p>
                        <button onClick={fetchTshirts} className="retry-btn">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    

    return (
        <div className="search-page-container">
            <h1>Premium T-Shirts Collection</h1>
            
            <div className="tshirt-controls">
                <div className="results-info">
                    <p>Showing all {tshirts.length} T-Shirts</p>
                </div>
            </div>

            {tshirts.length === 0 ? (
                <div className="no-tshirts-found">
                    <i className="fas fa-tshirt"></i>
                    <h3>No t-shirts available</h3>
                    <p>Check back later for new arrivals</p>
                </div>
            ) : (
                <div className="product-grid">
                    {tshirts.map((tshirt) => (
                        <Link 
                            to={`/product/${tshirt.numericId}?category=${encodeURIComponent(tshirt.Category)}`} 
                            key={tshirt.numericId} 
                            className="product-card"
                        >
                            <div className="product-image-container">
                                <img 
                                    src={getProductImage(tshirt.Category, tshirt.numericId)} 
                                    alt={tshirt.ProductName} 
                                    className="product-image" 
                                />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{tshirt.ProductName}</h3>
                                <p className="product-price">{tshirt.Price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TshirtPage;
