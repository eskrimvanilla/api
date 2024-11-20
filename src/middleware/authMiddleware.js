const { getAuth } = require('firebase-admin/auth');

const verifyToken = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Unauthorized' });
  }
};

module.exports = { verifyToken };