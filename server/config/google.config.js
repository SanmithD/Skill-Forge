import 'dotenv/config';

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET, 
  issuerBaseURL: process.env.IS_SUER_BASE_URL,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email'
  }
};

export default config;
