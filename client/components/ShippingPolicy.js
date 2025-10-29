import React from 'react';
import './ShippingPolicy.css';

const ShippingGuidelines = () => {
    return (
        <div className="shipping-policy">
            <div className="policy-header">
                <h1>Shipping Guidelines</h1>
                <p>Everything you need to know about our shipping process and delivery timelines</p>
            </div>

            <div className="policy-container">
                {/* Shipping Methods */}
                <section className="policy-section">
                    <h2>🚚 Shipping Methods & Partners</h2>
                    <div className="shipping-methods">
                        <div className="method-card">
                            <div className="method-icon">
                                <i className="fas fa-rocket"></i>
                            </div>
                            <h3>Standard Shipping</h3>
                            <p>Delivery within 5-7 business days</p>
                            <span className="method-price">FREE</span>
                        </div>
                        <div className="method-card">
                            <div className="method-icon">
                                <i className="fas fa-bolt"></i>
                            </div>
                            <h3>Express Shipping</h3>
                            <p>Delivery within 2-3 business days</p>
                            <span className="method-price">₹99</span>
                        </div>
                        <div className="method-card">
                            <div className="method-icon">
                                <i className="fas fa-shipping-fast"></i>
                            </div>
                            <h3>Next Day Delivery</h3>
                            <p>Delivery within 24 hours</p>
                            <span className="method-price">₹199</span>
                        </div>
                    </div>
                </section>

                {/* Delivery Timeline */}
                <section className="policy-section">
                    <h2>📅 Delivery Timeline</h2>
                    <div className="timeline-grid">
                        <div className="timeline-item">
                            <div className="timeline-number">1</div>
                            <div className="timeline-content">
                                <h4>Order Processing</h4>
                                <p>Orders are processed within 24-48 hours of payment confirmation</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-number">2</div>
                            <div className="timeline-content">
                                <h4>Shipment Dispatch</h4>
                                <p>Products are dispatched from our warehouse within 1 business day</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-number">3</div>
                            <div className="timeline-content">
                                <h4>In Transit</h4>
                                <p>Your order is shipped via our trusted partners</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-number">4</div>
                            <div className="timeline-content">
                                <h4>Out for Delivery</h4>
                                <p>You'll receive a notification when your order is out for delivery</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Service Areas */}
                <section className="policy-section">
                    <h2>🌍 Service Areas</h2>
                    <div className="service-areas">
                        <div className="area-card">
                            <h3>Metro Cities</h3>
                            <ul>
                                <li>Delhi NCR</li>
                                <li>Mumbai</li>
                                <li>Bangalore</li>
                                <li>Chennai</li>
                                <li>Kolkata</li>
                                <li>Hyderabad</li>
                            </ul>
                            <span className="delivery-time">2-4 days</span>
                        </div>
                        <div className="area-card">
                            <h3>Tier 2 Cities</h3>
                            <ul>
                                <li>Pune</li>
                                <li>Ahmedabad</li>
                                <li>Jaipur</li>
                                <li>Lucknow</li>
                                <li>Kochi</li>
                                <li>Chandigarh</li>
                            </ul>
                            <span className="delivery-time">4-6 days</span>
                        </div>
                        <div className="area-card">
                            <h3>Rest of India</h3>
                            <ul>
                                <li>All other cities & towns</li>
                                <li>Villages</li>
                                <li>Remote areas</li>
                            </ul>
                            <span className="delivery-time">5-7 days</span>
                        </div>
                    </div>
                </section>

                {/* Tracking & Support */}
                <section className="policy-section">
                    <h2>🔍 Tracking Your Order</h2>
                    <div className="tracking-info">
                        <div className="tracking-step">
                            <div className="step-icon">📧</div>
                            <h4>Order Confirmation</h4>
                            <p>You'll receive an email with your order details and tracking number</p>
                        </div>
                        <div className="tracking-step">
                            <div className="step-icon">📱</div>
                            <h4>Track Online</h4>
                            <p>Use our tracking page to monitor your shipment in real-time</p>
                        </div>
                        <div className="tracking-step">
                            <div className="step-icon">📞</div>
                            <h4>SMS Updates</h4>
                            <p>Receive SMS alerts for important delivery milestones</p>
                        </div>
                        <div className="tracking-step">
                            <div className="step-icon">👨‍💼</div>
                            <h4>Delivery Partner</h4>
                            <p>Contact the delivery partner directly for delivery queries</p>
                        </div>
                    </div>
                </section>

                {/* Important Notes */}
                <section className="policy-section important-notes">
                    <h2>📝 Important Notes</h2>
                    <div className="notes-grid">
                        <div className="note-card warning">
                            <i className="fas fa-exclamation-triangle"></i>
                            <h4>Address Accuracy</h4>
                            <p>Please ensure your shipping address is complete and accurate. We're not responsible for delays due to incorrect addresses.</p>
                        </div>
                        <div className="note-card info">
                            <i className="fas fa-info-circle"></i>
                            <h4>Business Days</h4>
                            <p>Delivery timelines exclude weekends and public holidays. Orders placed on Friday will be processed on Monday.</p>
                        </div>
                        <div className="note-card tip">
                            <i className="fas fa-lightbulb"></i>
                            <h4>Contact Information</h4>
                            <p>Keep your phone handy as delivery partners may call to confirm your availability.</p>
                        </div>
                        <div className="note-card warning">
                            <i className="fas fa-box-open"></i>
                            <h4>Inspect Package</h4>
                            <p>Always inspect your package before accepting delivery. Report any damage immediately.</p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="policy-section faq-section">
                    <h2>❓ Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4>Can I change my shipping address after ordering?</h4>
                            <p>Yes, you can change your shipping address within 2 hours of placing your order. Contact our customer support team for assistance.</p>
                        </div>
                        <div className="faq-item">
                            <h4>What if I'm not available during delivery?</h4>
                            <p>The delivery partner will attempt delivery 3 times. After that, your package will be returned to our warehouse and a restocking fee may apply.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Do you ship internationally?</h4>
                            <p>Currently, we only ship within India. We're working on expanding our international shipping options.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Can I track my order without a tracking number?</h4>
                            <p>Yes, you can track your order using your registered email address or phone number on our tracking page.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ShippingGuidelines;