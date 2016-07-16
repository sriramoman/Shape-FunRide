'use strict';

const express = require('express');
const request = require('request');

let router = express.Router();

// const User = require('../models/user');



router.get('/', (req,res) => {
  console.log("Request", req.params.id);
  request.get({
    url: `http://10.10.61.249:8080/dvr/playList?action=get`
    // url: `http://10.10.60.55
    // :8080/itv/startURL?url=http://google.com`
  },
  //
  function(err, response,body) {
    if(!err){
      res.send(body)
    }

  }
)
// res.send('ok\n')

})



module.exports = router;
