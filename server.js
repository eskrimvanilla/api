// server.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
require('./src/config/firebaseConfig');

const app = express();

// Allow all origins during development
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

app.get('/', (_req, res) => {
  res.json({ message: 'Auth API is running' });
});

app.use('/auth', authRoutes);

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});