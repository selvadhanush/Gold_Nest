module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d'
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  metalPriceAPI: {
    key: process.env.METAL_PRICE_API_KEY
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000'
  }
};