import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductImage } from './imageUtils';
import './CapsPage.css';

const CapsPage = () => {
    const [caps, setCaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCaps();
    }, []);

    const fetchCaps = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('/api/products/search/cap');
            
            if (!response.ok) {
                throw new Error('Failed to fetch caps');
            }
            
            const data = await response.json();
            
            if (data.success) {
                setCaps(data.data);
            } else {
                throw new Error(data.message || 'Failed to load caps');
            }
        } catch (error) {
            console.error('Error fetching caps:', error);
            setError('Failed to load caps. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="caps-page">
                <div className="caps-container">
                    <div className="loading">Loading caps...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="caps-page">
                <div className="caps-container">
                    <div className="error-message">
                        <i className="fas fa-exclamation-triangle"></i>
                        <h3>Oops! Something went wrong</h3>
                        <p>{error}</p>
                        <button onClick={fetchCaps} className="retry-btn">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="search-page-container">
            <h1>Premium Caps Collection</h1>
            
            <div className="caps-controls">
                <div className="results-info">
                    <p>Showing all {caps.length} Caps</p>
                </div>
            </div>

            {caps.length === 0 ? (
                <div className="no-caps-found">
                    <i className="fas fa-baseball-cap"></i>
                    <h3>No caps available</h3>
                    <p>Check back later for new arrivals</p>
                </div>
            ) : (
                <div className="product-grid">
                    {caps.map((cap) => (
                        <Link 
                            to={`/product/${cap.numericId}?category=${encodeURIComponent(cap.Category)}`} 
                            key={cap.numericId} 
                            className="product-card"
                        >
                            <div className="product-image-container">
                                <img 
                                    src={getProductImage(cap.Category, cap.numericId)} 
                                    alt={cap.ProductName} 
                                    className="product-image" 
                                />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{cap.ProductName}</h3>
                                <p className="product-price">{cap.Price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CapsPage;
