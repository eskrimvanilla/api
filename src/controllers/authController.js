const { getAuth } = require('firebase-admin/auth');

exports.signup = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName
    });

    res.status(201).json({
      message: 'User created successfully',
      userId: userRecord.uid
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    const userRecord = await getAuth().getUserByEmail(email);
    const customToken = await getAuth().createCustomToken(userRecord.uid);

    res.status(200).json({ token: customToken });
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
