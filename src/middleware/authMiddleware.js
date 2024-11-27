const { getAuth } = require('firebase-admin/auth');
const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'No authorization header' });
    }

    // Trim whitespace and split with a space
    const [bearer, idToken] = req.headers.authorization.trim().split(' ');

    // Additional checks
    if (bearer !== 'Bearer' || !idToken) {
      return res.status(403).json({ error: 'Invalid token format' });
    }

    console.log('Received Token:', idToken.trim());
    
    const decodedToken = await getAuth().verifyIdToken(idToken.trim());
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token Verification Error:', error.message);
    res.status(403).json({ 
      error: 'Unauthorized', 
      details: error.message 
    });
  }
};

module.exports = { verifyToken };