'use strict';

const express = require('express');

const User = require('../models/user');

let router = express.Router();

//    users.js
//    /api/users

router.get('/', User.authorize({admin: false}), (req, res) => {
  User.find({email: {$ne: req.user.email}}, (err, users) => {
    res.status(err ? 400 : 200).send(err || users);
  });
});

router.get('/profile', User.authorize({admin: false}), (req, res) => {
  res.send(req.user);
});

router.delete('/all', User.authorize({admin: true}), (req, res) => {
  User.remove({}, err => {
    res.status(err ? 400 : 200).send(err);
  });
});


router.put('/:id/toggleAdmin', User.authorize({admin: true}), (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if(err || !user) return res.status(400).send(err || {error: 'User not found.'});

    user.admin = !user.admin;

    user.save(err => {
      res.status(err ? 400 : 200).send(err);
    });
  });
});

router.post('/login', (req, res) => {
  User.authenticate(req.body, (err, token) => {
    res.status(err ? 400 : 200).send(err || {token: token});
  });
});

router.post('/signup', (req, res) => {
  User.register(req.body, (err, token) => {
    res.status(err ? 400 : 200).send(err || {token: token});
  });
});


router.post('/facebook', (req, res) => {
  User.facebook(req.body, function(err, token) {
    res.status(err ? 400 : 200).send({token: token});
  });
});

module.exports = router;
