import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import API_URL from '../config/apiConfig';
import './ProductDetailPage.css';
import AddToCartButton from './AddToCartButton';
import { getProductImage } from './imageUtils';

const ProductDetailPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);
    const [loadingRelated, setLoadingRelated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedError, setRelatedError] = useState(null);

    useEffect(() => {
        const fetchProductAndRelated = async () => {
            try {
                setLoading(true);
                setError(null);
                setRelatedError(null);
                
                // Get category from URL query parameters
                const searchParams = new URLSearchParams(location.search);
                const category = searchParams.get('category');
                
                // Build URL with category if available
                let url = `${API_URL}/products/${id}`;
                if (category) {
                    url += `?category=${encodeURIComponent(category)}`;
                }
                
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const productData = await response.json();
                
                if (!productData.data) {
                    throw new Error('Product data not available');
                }
                
                setProduct(productData.data);
                
                // Fetch related products after main product is loaded
                await fetchRelatedProducts(productData.data);
                
            } catch (error) {
                console.error('Error fetching product:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchRelatedProducts = async (productData) => {
            setLoadingRelated(true);
            setRelatedError(null);
            
            try {
                const productId = productData.numericId || productData.id || id;
                
                const response = await fetch(`${API_URL}/products/${productId}/related`);
                
                if (!response.ok) {
                    throw new Error('Unable to load related products');
                }
                
                const relatedData = await response.json();
                
                if (relatedData.success && relatedData.data) {
                    setRelatedProducts(relatedData.data);
                } else {
                    throw new Error('No related products available');
                }
                
            } catch (error) {
                setRelatedError(error.message);
                
                // Fallback: Try to fetch same category products manually
                await fetchFallbackRelatedProducts(productData);
            } finally {
                setLoadingRelated(false);
            }
        };

        const fetchFallbackRelatedProducts = async (productData) => {
            try {
                const response = await fetch(`${API_URL}/products/category/${encodeURIComponent(productData.Category)}`);
                
                if (response.ok) {
                    const categoryData = await response.json();
                    if (categoryData.success && categoryData.data) {
                        // Filter out current product and limit to 4
                        const filteredProducts = categoryData.data
                            .filter(p => (p.numericId !== productData.numericId) && (p._id !== productData._id))
                            .slice(0, 4);
                        
                        setRelatedProducts(filteredProducts);
                    }
                }
            } catch (fallbackError) {
                console.error('Fallback failed:', fallbackError);
                setRelatedProducts([]);
            }
        };

        fetchProductAndRelated();
    }, [id, location.search]);

    // Helper function to get the correct image
    const getProductImageSrc = (product) => {
        if (!product) return null;
        
        const numericId = product.numericId || product.id || product._id;
        return getProductImage(product.Category, numericId);
    };

    const handleQuantityChange = (amount) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    if (loading) {
        return (
            <div className="product-detail-loading">
                <div className="loading-spinner">Loading product...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-detail-error">
                <h2>Product Not Found</h2>
                <p>{error}</p>
                <Link to="/" className="back-to-home">Return to Homepage</Link>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-error">
                <h2>Product Not Available</h2>
                <p>The product you're looking for is not available.</p>
                <Link to="/" className="back-to-home">Return to Homepage</Link>
            </div>
        );
    }

    const productForCart = {
        ...product,
        selectedSize,
        quantity
    };

    const productImageSrc = getProductImageSrc(product);

    return (
        <div className="product-detail-page">
            {/* Breadcrumb Navigation */}
            <nav className="breadcrumb">
                <Link to="/">Home</Link>
                <span> / </span>
                <Link to={`/category/${product.Category}`}>{product.Category}</Link>
                <span> / </span>
                <span>{product.ProductName}</span>
            </nav>

            {/* Main Product Section */}
            <div className="product-detail-container">
                <div className="product-detail-image">
                    {productImageSrc ? (
                        <img 
                            src={productImageSrc} 
                            alt={product.ProductName}
                            className="product-main-image"
                        />
                    ) : (
                        <div className="no-image-placeholder large">
                            <p>Image not available</p>
                        </div>
                    )}
                </div>
                
                <div className="product-detail-info">
                    <h1 className="product-title">{product.ProductName}</h1>
                    
                    {product.Athlete && (
                        <p className="product-athlete-badge">Official {product.Athlete} Merchandise</p>
                    )}
                    
                    <p className="product-price">{product.Price}</p>
                    
                    {product.Description && (
                        <p className="product-description">{product.Description}</p>
                    )}
                    
                    <div className="product-features">
                        <p>• Official licensed merchandise</p>
                        <p>• Premium quality materials</p>
                        <p>• Fast shipping available</p>
                    </div>

                    {/* Size Selector */}
                    <div className="size-selector">
                        <label className="selector-label">Size:</label>
                        <div className="sizes">
                            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                <button
                                    key={size}
                                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => handleSizeSelect(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="quantity-selector">
                        <label className="selector-label">Quantity:</label>
                        <div className="quantity-controls">
                            <button 
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                                className="quantity-btn"
                            >
                                -
                            </button>
                            <span className="quantity-display">{quantity}</span>
                            <button 
                                onClick={() => handleQuantityChange(1)}
                                className="quantity-btn"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="add-to-cart-section">
                        <AddToCartButton product={productForCart} />
                    </div>

                    {/* Product Details */}
                    <div className="product-meta">
                        <div className="meta-item">
                            <strong>Category:</strong> {product.Category}
                        </div>
                        {product.Sport && (
                            <div className="meta-item">
                                <strong>Sport:</strong> {product.Sport}
                            </div>
                        )}
                        {product.Collection && (
                            <div className="meta-item">
                                <strong>Collection:</strong> {product.Collection}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            <section className="related-products-section">
                <h2 className="related-products-title">You Might Also Like</h2>
                <p className="related-products-subtitle">Check out these similar products</p>
                
                {loadingRelated ? (
                    <div className="related-products-loading">
                        <div className="loading-spinner-small">Finding related products...</div>
                    </div>
                ) : relatedError ? (
                    <div className="related-products-error">
                        <p>Unable to load related products.</p>
                        <Link to={`/category/${product.Category}`} className="browse-category-link">
                            Browse more {product.Category} products instead
                        </Link>
                    </div>
                ) : relatedProducts.length > 0 ? (
                    <div className="related-products-grid">
                        {relatedProducts.map((relatedProduct) => {
                            const relatedProductImageSrc = getProductImageSrc(relatedProduct);
                            return (
                                <div 
                                    key={relatedProduct.numericId || relatedProduct._id} 
                                    className="related-product-card"
                                >
                                    <Link 
                                        to={`/product/${relatedProduct.numericId}?category=${encodeURIComponent(relatedProduct.Category)}`}
                                        className="related-product-link"
                                    >
                                        <div className="related-product-image">
                                            {relatedProductImageSrc ? (
                                                <img 
                                                    src={relatedProductImageSrc} 
                                                    alt={relatedProduct.ProductName}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div className="no-image-placeholder small">
                                                <p>No Image</p>
                                            </div>
                                        </div>
                                        <div className="related-product-info">
                                            <h4 className="related-product-name">{relatedProduct.ProductName}</h4>
                                            <p className="related-product-price">{relatedProduct.Price}</p>
                                            {relatedProduct.Athlete && (
                                                <p className="related-product-athlete">{relatedProduct.Athlete}</p>
                                            )}
                                            <span className="view-product-link">View Product →</span>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-related-products">
                        <p>No related products found at the moment.</p>
                        <Link to={`/category/${product.Category}`} className="browse-category-link">
                            Browse more {product.Category} products
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProductDetailPage;
