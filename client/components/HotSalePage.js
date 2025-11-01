import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HotSalePage.css';
import { getProductImage } from './imageUtils';
import API_URL from '../config/apiConfig';

const HotSalePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products/hotsale`);
                const data = await response.json();
                if (data.success) {
                    setProducts(data.data);
                } else {
                    console.error('Failed to fetch hot sale products');
                }
            } catch (error) {
                console.error('Error fetching hot sale products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Calculate discount percentage
    const calculateDiscount = (originalPrice, currentPrice) => {
        if (!originalPrice || !currentPrice) return 0;
        
        const original = parseFloat(String(originalPrice).replace(/[^0-9.]/g, ''));
        const current = parseFloat(String(currentPrice).replace(/[^0-9.]/g, ''));
        
        if (original <= current) return 0;
        
        const discount = ((original - current) / original) * 100;
        return Math.round(discount);
    };

    // Remove currency symbols and format price
    const formatPrice = (price) => {
        if (!price) return '';
        return String(price).replace(/[₹,]/g, '').trim();
    };

    if (loading) {
        return <div className="loading">Loading hot sale products...</div>;
    }

    return (
        <div className="hotsale-page">
            <div className="hotsale-header">
                <h1>Hot Sale 🔥</h1>
                <p>Limited time offers and exclusive discounts</p>
            </div>
            
            <div className="product-grid">
                {products.length > 0 ? (
                    products.map(product => {
                        const discountPercent = calculateDiscount(product.originalPrice, product.Price);
                        const hasDiscount = discountPercent > 0;
                        
                        return (
                            <Link 
                                to={`/product/${product._id}`} 
                                key={product._id} 
                                className="product-card hotsale-card"
                            >
                                <div className="product-image-container">
                                    <img 
                                        src={getProductImage(product.Category, product.numericId)} 
                                        alt={product.ProductName} 
                                        className="product-image" 
                                    />
                                    <div className="sale-badge">SALE</div>
                                    {hasDiscount && (
                                        <div className="discount-badge">-{discountPercent}%</div>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.ProductName}</h3>
                                    <div className="price-container">
                                        {hasDiscount ? (
                                            <>
                                                <p className="original-price">₹{formatPrice(product.originalPrice)}</p>
                                                <p className="discount-price">₹{formatPrice(product.Price)}</p>
                                            </>
                                        ) : (
                                            <p className="current-price">₹{formatPrice(product.Price)}</p>
                                        )}
                                    </div>
                                    {hasDiscount && (
                                        <div className="discount-info">
                                            <span className="save-text">Save {discountPercent}%</span>
                                        </div>
                                    )}
                                    <div className="product-details">
                                        <span className="product-category">{product.Category}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="no-products">
                        <p>No hot sale products available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotSalePage;
