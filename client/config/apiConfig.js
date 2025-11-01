const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://www.merchforfan.shop/api'
  : 'http://localhost:5000/api';

export default API_URL;
