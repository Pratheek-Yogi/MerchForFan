import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './ProductDetailPage.css';
import AddToCartButton from './AddToCartButton';
import { getProductImage } from './imageUtils';

const ProductDetailPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Get category from URL query parameters
                const searchParams = new URLSearchParams(location.search);
                const category = searchParams.get('category');
                
                // Build URL with category if available
                let url = `/api/products/${id}`;
                if (category) {
                    url += `?category=${encodeURIComponent(category)}`;
                }
                
                console.log('Fetching product from:', url);
                
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                console.log('Product data:', data.data);
                setProduct(data.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id, location.search]);

    // Helper function to get the correct image
    const getProductImageSrc = (product) => {
        if (!product) return null;
        
        // Try different ID fields
        const numericId = product.numericId || product.id || product._id;
        console.log('Getting image for:', product.Category, numericId);
        
        return getProductImage(product.Category, numericId);
    };

    if (!product) {
        return <div className="loading-spinner">Loading...</div>;
    }

    const handleQuantityChange = (amount) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
    };

    const productForCart = {
        ...product,
        selectedSize,
        quantity
    };

    const productImageSrc = getProductImageSrc(product);

    return (
        <div className="product-detail-container">
            <div className="product-detail-image">
                {productImageSrc ? (
                    <img 
                        src={productImageSrc} 
                        alt={product.ProductName} 
                    />
                ) : (
                    <div className="no-image-placeholder">
                        <p>Image not available</p>
                    </div>
                )}
            </div>
            <div className="product-detail-info">
                <h1>{product.ProductName}</h1>
                <p className="product-price">{product.Price}</p>
                <p>Official merchandise for fans of {product.Category}.</p>

                <div className="size-selector">
                    <label>Size:</label>
                    <div className="sizes">
                        {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                            <button
                                key={size}
                                className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="quantity-selector">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                        <button onClick={() => handleQuantityChange(-1)}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => handleQuantityChange(1)}>+</button>
                    </div>
                </div>

                <AddToCartButton product={productForCart} />
            </div>
        </div>
    );
};

export default ProductDetailPage;