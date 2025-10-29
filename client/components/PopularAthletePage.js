import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { popularAthletes, getProductImage } from './imageUtils';
import './PopularAthletePage.css';

const PopularAthletePage = () => {
    const { athleteName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const athlete = popularAthletes.find(
        (a) => a.name.toLowerCase().replace(' ', '-') === athleteName
    );

    useEffect(() => {
        if (athlete) {
            fetchAthleteProducts();
        }
    }, [athlete]);

    const fetchAthleteProducts = async () => {
        try {
            setLoading(true);
            console.log('Fetching products for athlete:', athlete.name);
            
            // Use lowercase to match database
            const athleteNameForAPI = athlete.name.toLowerCase();
            const response = await fetch(`/api/products/athlete/${athleteNameForAPI}`);
            const data = await response.json();
            
            console.log('API Response:', data);
            
            if (data.success) {
                setProducts(data.data);
            } else {
                console.error('Failed to fetch athlete products:', data.message);
            }
        } catch (error) {
            console.error('Error fetching athlete products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!athlete) {
        return <div className="error-message">Athlete not found</div>;
    }

    return (
        <div className="athlete-page">
            <div className="athlete-page-header">
                <img src={athlete.image} alt={athlete.name} className="athlete-page-avatar" />
                <div className="athlete-page-info">
                    <h1>{athlete.name}</h1>
                    <p>{athlete.description}</p>
                </div>
            </div>

            {/* Products Section */}
            <div className="athlete-section">
                <h2 className="section-title">Official {athlete.name} Merchandise</h2>
                <p className="section-subtitle">Get authentic merchandise and fan gear</p>
                
                {loading ? (
                    <div className="loading">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="no-products">
                        <p>No merchandise available for {athlete.name} yet.</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map((product) => (
                            <Link 
                                to={`/product/${product.numericId}`} 
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
                                    <div className="view-details-text">
                                        View Details
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PopularAthletePage;