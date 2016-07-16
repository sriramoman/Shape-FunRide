'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const request = require('request');

const JWT_SECRET = process.env.JWT_SECRET;

let userSchema = new mongoose.Schema({
  email: String,
  password: String,
  displayName: String, // their name
  profileImage: String,
  admin: { type: Boolean, default: false },
  facebook: String  // Facebook profile id
});

userSchema.statics.authorize = function(paramsObj = {admin: false}) {
  return function(req, res, next) {
    let tokenHeader = req.headers.authorization;

    if(!tokenHeader) {
      return res.status(401).send({error: 'Missing authorization header.'});
    }

    let token = tokenHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if(err) return res.status(401).send(err);

  //  if(admin required  && user is not admin)
      if(paramsObj.admin && !payload.admin) {
        return res.status(401).send({error: 'Admin required.'})
      }

      User.findById(payload._id, (err, user) => {
        if(err || !user) return res.status(401).send(err || {error: 'User not found.'});

        req.user = user;

        next();
      }).select('-password');
    });
  }
};

userSchema.methods.generateToken = function() {
  let payload = {
    _id: this._id,
    admin: this.admin
  };

  let token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1 day'});

  return token;
};


userSchema.statics.register = function(userObj, cb) {

  // Check that the email is not taken
  // Create a new user document

  this.findOne({email: userObj.email}, (err, user) => {
    if(err || user) return cb(err || {error: 'A user already exists with this email address.'});
    
    this.create(userObj, (err, savedUser) => {
      if(err) return cb(err);

      let token = savedUser.generateToken();

      cb(null, token);
    });
  });
};

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 12, (err, hash) => {
    this.password = hash;
    next();
  });
});

userSchema.statics.authenticate = function(userObj, cb) {

  // try to find user document by email
  // check if email and password match
  // set login state

  this.findOne({email: userObj.email})
    .exec((err, user) => {
      if(err) return cb(err);

      if(!user) {
        return cb({error: 'Invalid email or password.'});
      }
      //           ( password attempt,   db hash )
      bcrypt.compare(userObj.password, user.password, (err, isGood) => {
        if(err || !isGood) return cb(err || {error: 'Invalid email or password.'});

        let token = user.generateToken();

        cb(null, token);
      });
    });
};

userSchema.statics.facebook = function(authCode, cb) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'picture'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');

  var params = {
    code: authCode.code,
    client_id: authCode.clientId,
    client_secret: process.env.FACEBOOK_SECRET,
    redirect_uri: authCode.redirectUri
  };
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return cb({ message: accessToken.error.message });
    }
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return cb({ message: profile.error.message });
      }
      User.findOne({facebook: profile.id}, (err, user) => {
        if(err) return cb(err);

        if(user) {
          let token = user.generateToken();
          cb(null, token);
        } else {
          let newUser = new User({
            email: profile.email,
            displayName: profile.name,
            profileImage: profile.picture.data.url,
            facebook: profile.id
          });
          newUser.save((err, savedUser) => {
            if(err) return cb(err);
            let token = savedUser.generateToken();
            cb(null, token);
          });
        }
      });
    });
  });
};


let User = mongoose.model('User', userSchema);

module.exports = User;
