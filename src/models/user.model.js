const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
    validate: validator.isEmail
  },
  username: {
    type: String,
    require: true
  },
  avatar: String,
  password: {
    type: String,
    require: true,
    select: false
  },
  address: String 
})

const User = mongoose.model('User', userSchema)
module.exports = User;