const { getAuth } = require('firebase-admin/auth');
const { formatResponse } = require('../utils/responseFormatter');
const fetch = require('node-fetch');

exports.signup = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json(
        formatResponse(false, null, 'Email and password are required')
      );
    }

    await getAuth().createUser({ email, password, displayName });

    res.status(201).json(formatResponse(true, null, 'User created successfully'));
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json(formatResponse(false, null, error.message));
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(
        formatResponse(false, null, 'Email and password are required')
      );
    }

    // Verify credentials with Firebase REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Authentication failed');
    }

    // Get user info
    const userRecord = await getAuth().getUserByEmail(email);

    res.status(200).json(formatResponse(true, {
      user: {
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL
      },
      token: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn
    }));
  } catch (error) {
    console.error('Error during login:', error);
    res.status(401).json(formatResponse(false, null, error.message || 'Authentication failed'));
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json(
        formatResponse(false, null, 'Refresh token is required')
      );
    }

    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Token refresh failed');
    }

    res.status(200).json(formatResponse(true, {
      token: data.id_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    }));
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json(formatResponse(false, null, error.message || 'Token refresh failed'));
  }
};
