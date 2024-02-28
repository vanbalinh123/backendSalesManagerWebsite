const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  codeStaff: {
    type: String,
    required: true
  },
  name: {
    type: String,
    maxlength: 100,
    minlength: 1,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  workingTime: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    min: 0,
    required: true
  },
  avatar: {
    type: String,
    required: true,
  }
});

const Staff = mongoose.model('Staff', StaffSchema);

module.exports = Staff;

