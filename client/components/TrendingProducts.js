import React, { useState, useEffect, useRef } from 'react';
import API_URL from '../config/apiConfig';
import './TrendingProducts.css';
import { getProductImage } from './imageUtils';
import { triggerCartUpdate } from './CartIcon';

function TrendingProducts() {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [addingToCart, setAddingToCart] = useState({});
    const sliderRef = useRef(null);
    const autoPlayRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const categories = ['Cricket', 'Football', 'Basketball', 'Limited Edition'];
            let fetchedProducts = [];

            for (const category of categories) {
                try {
                    const response = await fetch(`${API_URL}/products/category/${category}`);
                    const data = await response.json();
                    if (data.success) {
                        fetchedProducts = [...fetchedProducts, ...data.data.slice(0, 2)];
                    }
                } catch (error) {
                    console.error(`Failed to fetch products for category: ${category}`, error);
                }
            }
            setProducts(fetchedProducts);
        };

        fetchProducts();
    }, []);

    // Duplicate products for infinite effect
    const duplicatedProducts = products.length > 0 ? [...products, ...products, ...products] : [];

    const handleNext = () => {
        setCurrentIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        setCurrentIndex(prev => prev - 1);
    };

    const handleProductClick = (href) => {
        window.location.href = href;
    };

    // Check if product is in cart
    const isInCart = (productId, size = 'M') => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart.some(item => item.id === productId && item.size === size);
    };

    // Enhanced Add to Cart function for localStorage
    const handleAddToCart = async (product, event) => {
        event.preventDefault();
        event.stopPropagation(); // Stop the click from bubbling up to the parent
        
        const productId = product._id || product.numericId;
        
        // Set loading state for this specific product
        setAddingToCart(prev => ({ ...prev, [productId]: true }));

        try {
            // Get existing cart
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Check if product already exists in cart
            const existingItemIndex = cart.findIndex(item => 
                item.id === productId && item.size === 'M'
            );

            if (existingItemIndex > -1) {
                // Update quantity if item exists
                cart[existingItemIndex].quantity += 1;
            } else {
                // Add new item to cart
                const cartProduct = {
                    id: productId,
                    numericId: product.numericId,
                    name: product.ProductName,
                    price: product.Price,
                    oldPrice: product.OldPrice,
                    category: product.Category,
                    image: getProductImage(product.Category, product.numericId),
                    description: product.Description,
                    discount: product.Discount,
                    quantity: 1,
                    size: 'M', // Default size
                    color: 'Default'
                };
                cart.push(cartProduct);
            }

            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Trigger cart update event for CartIcon
            triggerCartUpdate();
            
            // Show success feedback
            console.log('Product added to cart:', product.ProductName);
            
        } catch (error) {
            console.error('Failed to add product to cart:', error);
            alert('Failed to add product to cart. Please try again.');
        } finally {
            // Clear loading state
            setAddingToCart(prev => ({ ...prev, [productId]: false }));
        }
    };

    // Auto-play functionality
    useEffect(() => {
        if (isAutoPlaying && products.length > 0) {
            autoPlayRef.current = setInterval(() => {
                setCurrentIndex(prev => prev + 1);
            }, 3000);
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [isAutoPlaying, products.length]);

    // Reset to middle when reaching ends for infinite effect
    useEffect(() => {
        if (products.length > 0 && currentIndex >= products.length * 2) {
            setCurrentIndex(products.length);
        } else if (products.length > 0 && currentIndex < 0) {
            setCurrentIndex(products.length - 1);
        }
    }, [currentIndex, products.length]);

    // Calculate transform for smooth sliding
    const getTransform = () => {
        const cardWidth = 280;
        return `translateX(-${currentIndex * cardWidth}px)`;
    };

    return (
        <section 
            className="trending-products"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <h2>Trending products</h2>
            
            {/* Navigation Buttons */}
            <div className="slider-nav">
                <button className="nav-btn prev-btn" onClick={handlePrev}>
                    ‹
                </button>
                <button className="nav-btn next-btn" onClick={handleNext}>
                    ›
                </button>
            </div>

            {/* Slider Container */}
            <div className="slider-container">
                <div 
                    className="slider-track" 
                    ref={sliderRef}
                    style={{ 
                        transform: getTransform(),
                        transition: 'transform 0.5s ease'
                    }}
                >
                    {duplicatedProducts.map((p, idx) => {
                        const productId = p._id || p.numericId;
                        const isAdding = addingToCart[productId];
                        const inCart = isInCart(productId);
                        
                        return (
                            <div 
                                className="tp-card" 
                                key={`${p._id}-${idx}`}
                                onClick={() => handleProductClick(`/product/${p.numericId}?category=${p.Category}`)}
                            >
                                <div className="tp-img-wrap">
                                    <img src={getProductImage(p.Category, p.numericId)} alt={p.ProductName} className="tp-img" />
                                    {p.Discount && <span className="tp-discount">-{p.Discount}%</span>}
                                    <button 
                                        className={`tp-badge ${inCart ? 'in-cart' : ''} ${isAdding ? 'adding' : ''}`}
                                        onClick={(e) => handleAddToCart(p, e)}
                                        disabled={isAdding}
                                    >
                                        {isAdding ? (
                                            <span className="loading-spinner">⏳</span>
                                        ) : inCart ? (
                                            '✓ In Cart'
                                        ) : (
                                            'Add to cart'
                                        )}
                                    </button>
                                </div>
                                <div className="tp-info">
                                    <div className="tp-title"><b>{p.ProductName}</b></div>
                                    <div className="tp-subtitle">{p.Description}</div>
                                    <div className="tp-pricing">
                                        {p.OldPrice && typeof p.OldPrice === 'number' && <span className="tp-old">₹{p.OldPrice.toFixed(2)}</span>}
                                        {p.Price && typeof p.Price === 'number' && <span className="tp-price">₹{p.Price.toFixed(2)}</span>}
                                    </div>
                                    <div className="tp-colors">1 COLOUR</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default TrendingProducts;
