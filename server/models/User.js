const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

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
  _id: { type: String, unique: true, default: uuidv4, } // Automatically generate object IDs
});


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [{ type: SubSchema, required: false }],
  MagicLink: { 
    type     : String, 
    required : false,
    unique   : false,
    default  : uuidv4
  },
  MagicLinkExpired: { 
    type     : Boolean, 
    default  : false
  }  
},
{strictQuery: false}
);

module.exports = mongoose.model("users", userSchema);