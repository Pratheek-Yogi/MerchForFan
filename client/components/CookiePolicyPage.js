import React from 'react';
import './AuthPages.css';

const CookiePolicyPage = () => {
  return (
    <div className="auth-page"> 
      {/* Removed inline style attributes */}
      <div className="auth-container" style={{ maxWidth: '800px', marginTop: '50px', marginBottom: '50px' }}>
        <div className="auth-header">
          <h1>Cookie Policy</h1>
        </div>
        <div style={{ textAlign: 'left', color: '#333' }}>
          <h2>What choices are available to you regarding collection, use and distribution of your information?</h2>
          <p>You can accept or decline the cookies. All websites that are customizable require that you accept cookies. You must also accept cookies to register as someone for access to some of our services. For information on how to set your browser to alert you to cookies, or to reject cookies, go to <a href="http://www.cookiecentral.com/" target="_blank" rel="noopener noreferrer">http://www.cookiecentral.com/</a>.</p>
          
          <h2>Cookies</h2>
          <p>A cookie is a small text file that is stored on a user's computer for record-keeping purposes. We use cookies on this Platform. We do link the information we store in cookies to any personally identifiable information you submit while on the Platform.</p>
          <p>We use both session ID cookies and persistent cookies. We use session cookies to make it easier and secure for you to navigate the Platform. A session ID cookie expires when you close your browser. A persistent cookie remains on your hard drive for an extended period of time. You can remove persistent cookies by following directions provided in your Internet browser's "help" file.</p>
          <p>If you reject cookies, you may still use the Platform, but your ability to use some areas of the Platform, will be limited. Cookies are used in the cart to enable enhanced security and to ensure there is no URL based spamming.</p>
          
          <h2>Voluntary disclosure of information</h2>
          <p>Supplying personally identifiable information is entirely voluntary. You are not required to register with us in order to use the Platforms. However, we offer some services only to visitors who do register.</p>
          <p>If you have any questions, comments or requests regarding our Cookie Policy or the website please contact us at hello@merchfan.com.</p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
