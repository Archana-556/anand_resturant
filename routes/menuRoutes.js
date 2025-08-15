// backend/routes/menuRoutes.js
const express = require('express');
const router = express.Router();

const MenuItem = require('../models/menuitem');


// Add item
// POST /api/menuItem
router.post('/', async (req, res) => {
  try{
  const newItem = new MenuItem(req.body);
  await newItem.save();
  res.status(201).json({ success: true, item: newItem });
  
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


// Get items
router.get('/all', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
