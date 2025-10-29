import React from 'react';
import './ReturnsPolicy.css';

const ReturnsPolicy = () => {
    return (
        <div className="returns-policy">
            <div className="policy-header">
                <h1>Returns & Exchange Policy</h1>
                <p>Hassle-free returns and exchanges for your complete peace of mind</p>
            </div>

            <div className="policy-container">
                {/* Return Timeline */}
                <section className="policy-section">
                    <h2>⏰ Return Timeline</h2>
                    <div className="return-timeline">
                        <div className="timeline-visual">
                            <div className="timeline-point active">
                                <div className="point-circle">1</div>
                                <div className="point-label">Receive Product</div>
                            </div>
                            <div className="timeline-line"></div>
                            <div className="timeline-point">
                                <div className="point-circle">2</div>
                                <div className="point-label">7 Days Return Window</div>
                            </div>
                            <div className="timeline-line"></div>
                            <div className="timeline-point">
                                <div className="point-circle">3</div>
                                <div className="point-label">Initiate Return</div>
                            </div>
                            <div className="timeline-line"></div>
                            <div className="timeline-point">
                                <div className="point-circle">4</div>
                                <div className="point-label">Refund Processed</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Return Conditions */}
                <section className="policy-section">
                    <h2>✅ Return Conditions</h2>
                    <div className="conditions-grid">
                        <div className="condition-card valid">
                            <div className="condition-icon">✓</div>
                            <h4>Valid Reasons for Return</h4>
                            <ul>
                                <li>Wrong size delivered</li>
                                <li>Product damaged during shipping</li>
                                <li>Wrong product delivered</li>
                                <li>Manufacturing defects</li>
                                <li>Significant color mismatch</li>
                            </ul>
                        </div>
                        <div className="condition-card invalid">
                            <div className="condition-icon">✗</div>
                            <h4>Non-Returnable Items</h4>
                            <ul>
                                <li>Personalized/customized products</li>
                                <li>Products without original tags</li>
                                <li>Used or washed items</li>
                                <li>Accessories without packaging</li>
                                <li>Sale/clearance items</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Return Process */}
                <section className="policy-section">
                    <h2>🔄 Return Process</h2>
                    <div className="process-steps">
                        <div className="process-step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h4>Initiate Return</h4>
                                <p>Go to 'My Orders' section and select the item you want to return</p>
                            </div>
                        </div>
                        <div className="process-step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h4>Choose Reason</h4>
                                <p>Select the reason for return and provide necessary details</p>
                            </div>
                        </div>
                        <div className="process-step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h4>Print Label</h4>
                                <p>Download and print the return shipping label</p>
                            </div>
                        </div>
                        <div className="process-step">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h4>Package & Ship</h4>
                                <p>Pack the item with original tags and packaging</p>
                            </div>
                        </div>
                        <div className="process-step">
                            <div className="step-number">5</div>
                            <div className="step-content">
                                <h4>Refund Processed</h4>
                                <p>Refund initiated within 3-5 business days of receiving the return</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Refund Information */}
                <section className="policy-section">
                    <h2>💰 Refund Information</h2>
                    <div className="refund-info">
                        <div className="refund-card">
                            <h4>Refund Methods</h4>
                            <div className="refund-methods">
                                <div className="method">
                                    <i className="fas fa-credit-card"></i>
                                    <span>Original Payment Method</span>
                                </div>
                                <div className="method">
                                    <i className="fas fa-wallet"></i>
                                    <span>Store Credit (Instant)</span>
                                </div>
                                <div className="method">
                                    <i className="fas fa-university"></i>
                                    <span>Bank Transfer</span>
                                </div>
                            </div>
                        </div>
                        <div className="refund-card">
                            <h4>Refund Timeline</h4>
                            <div className="timeline-details">
                                <div className="timeline-item">
                                    <span className="time">3-5 days</span>
                                    <span className="description">Processing after receiving return</span>
                                </div>
                                <div className="timeline-item">
                                    <span className="time">7-10 days</span>
                                    <span className="description">Credit Card/Bank Transfer</span>
                                </div>
                                <div className="timeline-item">
                                    <span className="time">Instant</span>
                                    <span className="description">Store Credit</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Exchange Policy */}
                <section className="policy-section">
                    <h2>🔄 Exchange Policy</h2>
                    <div className="exchange-info">
                        <div className="exchange-card">
                            <h4>Size Exchange</h4>
                            <p>Free size exchange within 7 days of delivery</p>
                            <ul>
                                <li>Product must be unworn and unwashed</li>
                                <li>Original tags must be attached</li>
                                <li>Available sizes only</li>
                            </ul>
                        </div>
                        <div className="exchange-card">
                            <h4>Color Exchange</h4>
                            <p>Color exchange subject to availability</p>
                            <ul>
                                <li>Same conditions as size exchange apply</li>
                                <li>Available colors only</li>
                                <li>Free return shipping</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Contact Support */}
                <section className="policy-section support-section">
                    <h2>📞 Need Help?</h2>
                    <div className="support-options">
                        <div className="support-card">
                            <i className="fas fa-phone"></i>
                            <h4>Call Us</h4>
                            <p>1800-123-4567</p>
                            <span>Mon-Sun, 9AM-9PM</span>
                        </div>
                        <div className="support-card">
                            <i className="fas fa-envelope"></i>
                            <h4>Email Us</h4>
                            <p>returns@yourstore.com</p>
                            <span>Response within 24 hours</span>
                        </div>
                        <div className="support-card">
                            <i className="fas fa-comments"></i>
                            <h4>Live Chat</h4>
                            <p>Available on website</p>
                            <span>Instant support</span>
                        </div>
                        <div className="support-card">
                            <i className="fas fa-map-marker-alt"></i>
                            <h4>Return Address</h4>
                            <p>Your Store Returns<br />123 Business Street<br />Mumbai, MH 400001</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ReturnsPolicy;