import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from './debounce';
import { getProductImage } from './imageUtils';
import './SearchPage.css';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/products/search/${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        if (data.success) {
          setResults(data.data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 300), // 300ms delay
    []
  );

  // Trigger search when query changes
  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      performSearch(query);
    } else {
      setResults([]);
      setSearched(false);
      setLoading(false);
    }
  }, [query, performSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="search-page-container">
      <h1>Search for Products</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for jerseys, athletes, teams..."
          className="search-input-full"
          autoFocus
        />
        <button type="submit" className="search-button-full">Search</button>
      </form>

      {loading && <div className="loading-spinner">Searching...</div>}

      {!loading && searched && (
        <div className="search-results-container">
          <h2>Results for "{query}"</h2>
          <div className="product-grid">
            {results.length > 0 ? (
              results.map(product => (
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
              ))
            ) : (
              <p>No products found matching your search.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default SearchPage;
