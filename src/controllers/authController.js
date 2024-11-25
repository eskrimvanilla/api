const { getAuth } = require('firebase-admin/auth');

exports.signup = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName
    });

    // Create a custom token for testing
    const customToken = await getAuth().createCustomToken(userRecord.uid);

    res.status(201).json({
      message: 'User created successfully',
      userId: userRecord.uid,
      token: customToken
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const userRecord = await getAuth().getUserByEmail(email);
    const customToken = await getAuth().createCustomToken(userRecord.uid);

    res.status(200).json({ 
      userId: userRecord.uid,
      token: customToken 
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};