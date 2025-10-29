import React from 'react';
import './AuthPages.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="auth-page"> 
      {/* Removed inline style attributes */}
      <div className="auth-container" style={{ maxWidth: '800px', marginTop: '50px', marginBottom: '50px' }}>
        <div className="auth-header">
          <h1>Privacy Policy</h1>
        </div>
        <div style={{ textAlign: 'left', color: '#333' }}>
          <p>Merch Fan (“Company”) carries out its business from its online stores.</p>
          <p>Company respects your privacy and this Privacy Policy outlines the manner in which your data is collected by us through our various interactions with you on the Platform, including data shared by you on your agreeing to become a user on the Platform and continuing to remain / avail the user benefits after becoming a user and the manner in which the data so collected is used by Company. You are advised to please read the Privacy Policy carefully.</p>
          <p>By accessing the services provided by the Platform and/or continuing to remain / avail user benefits, you agree to the collection and use of your data by the Company in the manner provided in this Privacy Policy.</p>
          <p>If you have questions or concerns regarding this statement, write to us at hello@merchfan.com. The Platform may have links to third party websites/apps. This Policy does not apply to the procedures and practices followed by third party websites/apps that are not managed, owned or controlled by the Company. Data provided by you to such third party websites/apps shall be governed by their privacy policy.</p>
          
          <h2>Information that may be Collected from You?</h2>
          <p>The Company collects the details provided by you on registration together with information we learn about you from your use of our service and your visits to the Platform.</p>
          <p>We take customer data privacy very seriously. Kindly, note that the Company does not access or store your Payment Card details (i.e. credit/debit card number, expiration date, CVV etc.). When you make a purchase using your card, all required transaction details are captured on the secured payment page, and encrypted using Industrial Strength Cipher, and are securely transmitted to your card issuer for obtaining an authorization decision. At no time during the purchase process or thereafter does the Company have access to, or store, your complete card account information.</p>
          
          <h2>When / How do we collect the Information?</h2>
          <p>We will collect anonymous traffic information from you when you visit our Platform. We collect the personally identifiable information from you when you register with us or you transact as a guest. During registration you are required to give us your contact information (such as name, email address, etc.). Upon registration users may receive communications from us (e.g. newsletters, updates).</p>
          
          <h2>How is the information used?</h2>
          <p>We use your contact information to send you password reminders, registration confirmations, special offers, and changes in service policies. We use your personal information to improve personalized features on our Platform, to contact you for your account/profile related matters, and to provide the services requested by you.</p>

          <h2>Who do we share your information with?</h2>
          <p>We do not rent, sell or share your personal information and we will not disclose any of your personally identifiable information to any other third parties unless required by special circumstances such as compliance with subpoenas, court orders, or legal processes.</p>
          
          <h2>Security Procedures</h2>
          <p>To protect against the loss, misuse and alteration of the information under our control, we have in place appropriate physical, electronic and managerial procedures. For example, our servers are accessible only to authorized personnel. Although we will endeavor to safeguard the confidentiality of your personally identifiable information, transmissions made by means of the Internet cannot be made absolutely secure.</p>

          <h2>Policy updates</h2>
          <p>We reserve the right to change or update this policy at any time by placing a prominent notice on the Platform. Such changes shall be effective immediately upon posting to this Platform.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
