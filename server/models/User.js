const mongoose = require("mongoose");

  // { 
  // image: [sundubu],
  // name: "Sundubu Jjigae Tofu Stew",
  // description: "Spicey soup with tofu, mushrooms, clams and vegetables",
  // price: 1599, 
  // quantity: 1
  // },

const SubSchema = new mongoose.Schema({
  image: { type: Array },
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true } // Automatically generate object IDs
});


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [{ type: SubSchema, required: false }],
  receipts: { type: Array, required: false}
});

module.exports = mongoose.model("users", userSchema);