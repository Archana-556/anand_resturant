const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
const menuRoutes = require('./routes/menuRoutes');
app.use('/api/menuItem', menuRoutes);

// Serve static files from ../public
app.use(express.static(path.join(__dirname, '../public')));

// Default route (homepage)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log(err));

// Export app for Vercel
module.exports = app;

// If running locally, start server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
