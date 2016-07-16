'use strict';

const mongoose = require('mongoose');
const request = require('request');

let testSchema = new mongoose.Schema({
  email: String,
  password: String,
  displayName: String, // their name
  profileImage: String,
  admin: { type: Boolean, default: false },
  facebook: String  // Facebook profile id
});



let Test = mongoose.model('Test', testSchema);

module.exports = Test;
