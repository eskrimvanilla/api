const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const userRecord = await getAuth().getUser(uid);

    res.status(200).json({
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      metadata: {
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime
      }
    });
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { displayName, photoURL } = req.body;

    const updatedUser = await getAuth().updateUser(uid, {
      displayName,
      photoURL
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        displayName: updatedUser.displayName,
        photoURL: updatedUser.photoURL
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user account
exports.deleteUserAccount = async (req, res) => {
  try {
    const uid = req.user.uid;
    await getAuth().deleteUser(uid);

    res.status(200).json({
      message: 'User account deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};