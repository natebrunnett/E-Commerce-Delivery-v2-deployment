const mongoose = require("mongoose");

  // { 
  // image: [sundubu],
  // name: "Sundubu Jjigae Tofu Stew",
  // description: "Spicey soup with tofu, mushrooms, clams and vegetables",
  // price: 1599, 
  // quantity: 1
  // },

const productSchema = new mongoose.Schema({
  image: {type: Array, required: false},
  name: {type: String, required: true},
  description: {type: String, required: false},
  price: {type: Number, required: true},
  quantity: {type: Number, required: false}   
});

module.exports = mongoose.model("products", productSchema);