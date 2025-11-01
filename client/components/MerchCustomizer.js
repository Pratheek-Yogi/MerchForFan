import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import './MerchCustomizer.css';
import TshirtCanvas from './TshirtCanvas';
import HoodieCanvas from './HoodieCanvas';
import API_URL from '../config/apiConfig';

function MerchCustomizer() {
  const [color, setColor] = useState('#ffffff');
  const [selectedModel, setSelectedModel] = useState('tshirt');
  const [textureImage, setTextureImage] = useState(null);
  const [decalScale, setDecalScale] = useState(1);
  const [decalPositionX, setDecalPositionX] = useState(0);
  const [decalPositionY, setDecalPositionY] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const canvasRef = useRef(null);
  const tshirtCanvasRef = useRef(null);
  const hoodieCanvasRef = useRef(null);

  const modelDefaults = {
    tshirt: { 
      scale: 1, 
      posX: 0, 
      posY: 0, 
      price: 799, 
      name: 'Custom T-Shirt',
      numericIdPrefix: 1000
    },
    hoodie: { 
      scale: 0.6, 
      posX: 0, 
      posY: -0.1, 
      price: 1199, 
      name: 'Custom Hoodie',
      numericIdPrefix: 1100
    },
  };

  useEffect(() => {
    const defaults = modelDefaults[selectedModel];
    setDecalScale(defaults.scale);
    setDecalPositionX(defaults.posX);
    setDecalPositionY(defaults.posY);
  }, [selectedModel]);

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTextureImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setTextureImage(null);
  };

  // Get the active canvas component reference
  const getActiveCanvasRef = () => {
    return selectedModel === 'tshirt' ? tshirtCanvasRef : hoodieCanvasRef;
  };

  // Capture canvas as JPG - FIXED VERSION
  const captureDesignImage = () => {
    const activeCanvasRef = getActiveCanvasRef();
    
    if (activeCanvasRef.current) {
      // For Three.js canvases, we need to use the renderer's domElement
      const canvas = activeCanvasRef.current.getCanvas ? activeCanvasRef.current.getCanvas() : null;
      
      if (canvas) {
        try {
          // Add a small delay to ensure the scene is fully rendered
          return new Promise((resolve) => {
            setTimeout(() => {
              const imageData = canvas.toDataURL('image/jpeg', 0.9);
              resolve(imageData);
            }, 100);
          });
        } catch (error) {
          console.error('Error capturing canvas:', error);
          return null;
        }
      }
    }
    
    // Fallback: try to find canvas in DOM
    const canvasElement = canvasRef.current?.querySelector('canvas');
    if (canvasElement) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const imageData = canvasElement.toDataURL('image/jpeg', 0.9);
          resolve(imageData);
        }, 100);
      });
    }
    
    return Promise.resolve(null);
  };

  const downloadImage = async () => {
    const imageData = await captureDesignImage();
    if (imageData) {
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `custom-${selectedModel}-design.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Unable to capture design image. Please try again.');
    }
  };

  const resetCustomization = () => {
    setColor('#ffffff');
    setTextureImage(null);
    const defaults = modelDefaults[selectedModel];
    setDecalScale(defaults.scale);
    setDecalPositionX(defaults.posX);
    setDecalPositionY(defaults.posY);
    setQuantity(1);
    setSelectedSize('M');
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Generate unique numeric ID for custom product
  const generateCustomNumericId = () => {
    const defaults = modelDefaults[selectedModel];
    const randomSuffix = Math.floor(Math.random() * 99) + 1; // 1-99
    return defaults.numericIdPrefix + randomSuffix;
  };

  // Create custom product object for cart
  const createCustomProduct = async () => {
    const defaults = modelDefaults[selectedModel];
    const designImage = await captureDesignImage();
    const customNumericId = generateCustomNumericId();
    
    if (!designImage) {
      throw new Error('Unable to capture design image. Please try again.');
    }
    
    return {
      // Custom product identification
      isCustomProduct: true,
      customProductId: `custom_${selectedModel}_${Date.now()}`,
      
      // STANDARD FIELDS THAT MATCH CART EXPECTATIONS
      id: customNumericId,
      name: `${defaults.name}${textureImage ? ' (Custom Design)' : ' (Solid Color)'}`,
      price: defaults.price,
      size: selectedSize,
      quantity: quantity,
      image: designImage,
      
      // Additional fields for compatibility
      numericId: customNumericId,
      ProductName: `${defaults.name}${textureImage ? ' (Custom Design)' : ' (Solid Color)'}`,
      Price: `₹${defaults.price}`,
      Category: 'Custom',
      
      // Customization details
      customization: {
        modelType: selectedModel,
        baseColor: color,
        designImage: textureImage,
        designScale: decalScale,
        designPosition: { x: decalPositionX, y: decalPositionY },
        designPreview: designImage,
        timestamp: new Date().toISOString()
      }
    };
  };

  const addToCart = async () => {
    setIsAddingToCart(true);
    
    try {
      const customProduct = await createCustomProduct();
      
      // Get existing cart
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if similar custom product already exists
      const existingIndex = existingCart.findIndex(item => 
        item.isCustomProduct && 
        item.customization.modelType === customProduct.customization.modelType &&
        item.customization.baseColor === customProduct.customization.baseColor &&
        item.customization.designImage === customProduct.customization.designImage &&
        item.size === customProduct.size
      );
      
      if (existingIndex !== -1) {
        // Update quantity if similar product exists
        existingCart[existingIndex].quantity += customProduct.quantity;
      } else {
        // Add new custom product
        existingCart.push(customProduct);
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Optional: Send to backend if needed
      try {
        await fetch(`${API_URL}/cart/add-custom`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customProduct),
        });
      } catch (backendError) {
        console.log('Custom product saved locally (backend unavailable)');
      }
      
      // Show success message
      alert('✅ Custom product added to cart!');
      
      // Trigger cart update event for other components
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(`Failed to add product to cart: ${error.message}`);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getCurrentPrice = () => {
    return modelDefaults[selectedModel].price;
  };

  return (
    <div className="customizer">
      {/* Controls Panel */}
      <div className="customizer-toolbar">
        {/* Model Selection */}
        <div className="section">
          <div className="section-title">Product Type</div>
          <div className="row">
            <button 
              className={`btn ${selectedModel === 'tshirt' ? 'active' : ''}`} 
              onClick={() => setSelectedModel('tshirt')}
            >
              👕 T-shirt
            </button>
            <button 
              className={`btn ${selectedModel === 'hoodie' ? 'active' : ''}`} 
              onClick={() => setSelectedModel('hoodie')}
            >
              🧥 Hoodie
            </button>
          </div>
          <div className="price-display">
            Price: ₹{getCurrentPrice()}
          </div>
        </div>

        {/* Size & Quantity */}
        <div className="section">
          <div className="section-title">Size & Quantity</div>
          
          <div className="row">
            <label>Size:</label>
            <div className="size-options">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="row">
            <label>Quantity:</label>
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
        </div>

        {/* Color Customization */}
        <div className="section">
          <div className="section-title">Color & Design</div>
          <div className="row">
            <label>Base Color:</label>
            <div className="color-picker-container">
              <input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)} 
              />
              <button className="btn" onClick={() => setColor('#ffffff')}>
                Reset
              </button>
            </div>
          </div>

          <div className="row">
            <label>Upload Design:</label>
            <div className="file-upload-container">
              <input 
                type="file" 
                accept="image/*" 
                onChange={onUpload} 
              />
            </div>
          </div>

          {textureImage && (
            <div className="preview-image">
              <img src={textureImage} alt="Uploaded design preview" />
              <div className="hint">Design Preview - Click Remove to delete</div>
            </div>
          )}
        </div>

        {/* Design Controls */}
        {textureImage && (
          <div className="section">
            <div className="section-title">Design Adjustment</div>
            
            <div className="row">
              <label>Scale:</label>
              <div className="range-slider-container">
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.01"
                  value={decalScale}
                  onChange={(e) => setDecalScale(parseFloat(e.target.value))}
                />
                <span className="range-value">{decalScale.toFixed(2)}</span>
              </div>
            </div>

            <div className="row">
              <label>Position X:</label>
              <div className="range-slider-container">
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={decalPositionX}
                  onChange={(e) => setDecalPositionX(parseFloat(e.target.value))}
                />
                <span className="range-value">{decalPositionX.toFixed(2)}</span>
              </div>
            </div>

            <div className="row">
              <label>Position Y:</label>
              <div className="range-slider-container">
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={decalPositionY}
                  onChange={(e) => setDecalPositionY(parseFloat(e.target.value))}
                />
                <span className="range-value">{decalPositionY.toFixed(2)}</span>
              </div>
            </div>

            <div className="row">
              <button className="btn danger" onClick={removeImage}>
                🗑️ Remove Design
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="section">
          <div className="section-title">Export & Cart</div>
          <div className="row">
            <button 
              className="btn primary large" 
              onClick={addToCart}
              disabled={isAddingToCart || isModelLoading}
            >
              {isAddingToCart ? 'Adding to Cart...' : '🛒 Add to Cart'}
            </button>
          </div>
          <div className="row">
            <button className="btn" onClick={downloadImage}>
              📥 Download JPG
            </button>
            <button className="btn" onClick={resetCustomization}>
              🔄 Reset All
            </button>
          </div>
          <div className="hint">
            Add your custom design to cart or download as JPG for printing reference
          </div>
        </div>
      </div>

      {/* 3D Preview */}
      <div className="customizer-stage" ref={canvasRef}>
        <div className="model-selector">
          <button 
            className={`btn ${selectedModel === 'tshirt' ? 'active' : ''}`} 
            onClick={() => setSelectedModel('tshirt')}
          >
            T-shirt
          </button>
          <button 
            className={`btn ${selectedModel === 'hoodie' ? 'active' : ''}`} 
            onClick={() => setSelectedModel('hoodie')}
          >
            Hoodie
          </button>
        </div>

        {isModelLoading && (
          <div className="loader">Loading 3D Model...</div>
        )}

        {selectedModel === 'tshirt' ? (
          <TshirtCanvas
            ref={tshirtCanvasRef}
            color={color}
            textureImage={textureImage}
            decalScale={decalScale}
            decalPositionX={decalPositionX}
            decalPositionY={decalPositionY}
            onModelLoad={() => setIsModelLoading(false)}
          />
        ) : (
          <HoodieCanvas
            ref={hoodieCanvasRef}
            color={color}
            textureImage={textureImage}
            decalScale={decalScale}
            decalPositionX={decalPositionX}
            decalPositionY={decalPositionY}
            onModelLoad={() => setIsModelLoading(false)}
          />
        )}
      </div>
    </div>
  );
}

export default MerchCustomizer;
