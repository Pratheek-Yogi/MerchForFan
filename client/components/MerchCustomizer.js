import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import './MerchCustomizer.css';
import TshirtCanvas from './TshirtCanvas';
import HoodieCanvas from './HoodieCanvas';

function MerchCustomizer() {
  const [color, setColor] = useState('#ffffff');
  const [selectedModel, setSelectedModel] = useState('tshirt');
  const [textureImage, setTextureImage] = useState(null);
  const [decalScale, setDecalScale] = useState(1);
  const [decalPositionX, setDecalPositionX] = useState(0);
  const [decalPositionY, setDecalPositionY] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const canvasRef = useRef(null);

  const modelDefaults = {
    tshirt: { scale: 1, posX: 0, posY: 0 },
    hoodie: { scale: 0.6, posX: 0, posY: -0.1 },
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

  const downloadPdf = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (canvas) {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 10, 10, width - 20, height - 20);
      pdf.save('custom-design.pdf');
    }
  };

  const resetCustomization = () => {
    setColor('#ffffff');
    setTextureImage(null);
    const defaults = modelDefaults[selectedModel];
    setDecalScale(defaults.scale);
    setDecalPositionX(defaults.posX);
    setDecalPositionY(defaults.posY);
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
          <div className="section-title">Export & Reset</div>
          <div className="row">
            <button className="btn primary" onClick={downloadPdf}>
              📥 Download PDF
            </button>
            <button className="btn" onClick={resetCustomization}>
              🔄 Reset All
            </button>
          </div>
          <div className="hint">
            Download your custom design as a high-quality PDF for printing
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
            color={color}
            textureImage={textureImage}
            decalScale={decalScale}
            decalPositionX={decalPositionX}
            decalPositionY={decalPositionY}
            onModelLoad={() => setIsModelLoading(false)}
          />
        ) : (
          <HoodieCanvas
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