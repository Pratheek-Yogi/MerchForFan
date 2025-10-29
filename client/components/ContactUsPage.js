import React, { useState } from 'react';
import './AuthPages.css'; // Reusing styles for consistency
import './ContactUsPage.css'; // For specific styles

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    issue: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setMessage('Thank you for contacting us! We will get back to you shortly.');
      setLoading(false);
      setFormData({ name: '', email: '', phone: '', issue: '' });
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="auth-form-center-wrapper"> {/* ADDED NEW WRAPPER HERE */}
        <div className="auth-container">
          <div className="auth-header">
            <h1>Contact Us</h1>
            <p>We're here to help. Please fill out the form below.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number (optional)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="issue">Your Issue or Question</label>
              <textarea
                id="issue"
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Please describe your issue in detail"
              ></textarea>
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          {message && (
            <div className="message success" style={{ marginTop: '20px' }}>
              {message}
            </div>
          )}

          <div className="contact-footer">
            <div className="social-icons">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                {/* Instagram SVG Icon */}
                <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.268.058 2.148.277 2.912.565.787.293 1.457.708 2.122 1.373s1.08 1.335 1.373 2.122c.288.764.507 1.644.565 2.912.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.058 1.268-.277 2.148-.565 2.912-.293.787-.708 1.457-1.373 2.122s-1.335 1.08-2.122 1.373c-.764.288-1.644.507-2.912.565-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.268-.058-2.148-.277-2.912-.565-.787-.293-1.457-.708-2.122-1.373s-1.335-1.08-2.122-1.373c-.288-.764-.507-1.644-.565-2.912-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.058-1.268.277-2.148.565-2.912.293-.787.708-1.457 1.373-2.122s1.335-1.08 2.122-1.373c.764-.288 1.644-.507 2.912-.565C8.416 2.175 8.796 2.163 12 2.163m0-1.618c-3.26 0-3.66.014-4.944.072-1.28.058-2.25.282-3.05.585-.81.303-1.55.72-2.22 1.387-.67.667-1.084 1.41-1.387 2.22-.303.8-.527 1.77-.585 3.05C2.175 8.34 2.163 8.74 2.163 12s.012 3.66.072 4.944c.058 1.28.282 2.25.585 3.05.303.81.717 1.55 1.387 2.22.67.67 1.41 1.084 2.22 1.387.8.303 1.77.527 3.05.585 1.284.058 1.684.072 4.944.072s3.66-.014 4.944-.072c1.28-.058 2.25-.282 3.05-.585.81-.303 1.55-.717 2.22-1.387.67-.67 1.41-1.084 2.22-1.387.8-.303 1.77-.527 3.05-.585C15.66 2.177 15.26 2.163 12 2.163z"></path><path d="M12 7.272a4.728 4.728 0 100 9.456 4.728 4.728 0 000-9.456zm0 7.838a3.11 3.11 0 110-6.22 3.11 3.11 0 010 6.22z"></path><circle cx="16.965" cy="7.035" r="1.125"></circle></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                {/* Twitter/X SVG Icon */}
                <svg viewBox="0 0 24 24" width="24" height="24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              </a>
            </div>
            <div className="contact-email">
              Email: <a href="mailto:hello@merchforfans.com">hello@merchforfans.com</a>
            </div>
          </div>
        </div>
      </div> {/* CLOSED NEW WRAPPER HERE */}
    </div>
  );
};

export default ContactUsPage;
