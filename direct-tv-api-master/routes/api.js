'use strict';

const express = require('express');

let router = express.Router();

router.use('/users', require('./users'));
router.use('/videos', require('./videos'))
// router.use('/generalStocks', require('./generalStocks'))

module.exports = router;
