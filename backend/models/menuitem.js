
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
   name: String,
  price: Number,
  offerprice: Number, // Price after discount
  offer: Number,       // Discount percentage
  quantity: Number,
  category: String,   // Veg, Non-Veg, etc.
  cuisine: String,    // Indian, Chinese
  description: String,
  image: String,
  quantity: Number
});

module.exports = mongoose.model('MenuItem', menuItemSchema);

