require('module-alias/register');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const apiRoutes = require('@src/routes/main');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
  });

// Routes
app.use('/api', apiRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err && Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json({
    error: err && err.message ? err.message : 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
