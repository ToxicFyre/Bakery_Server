/* jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const {userDB, orderDB, productDB} = require('../sources/model_user.js');

/* TODO: Lookup app linking
* * - Write Business Logic
* *   - Write business logic for users
* *   - Write business logic for products
* *   - Write business logic for orders
 */

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

/********************************************
 * User interaction
********************************************/

router.get('/list-sports', (req, res, next) => {

  ListSports.get()
      .then( sports => {
        res.status(200).json({
          message : "Successfully sent the list of sports",
          status : 200,
          sports : sports
        });
      }).catch( err => {
    res.status(500).json({
      message: `Internal server error.`,
      status: 500
    });
    return next();
  });
});

router.post('/post-sport', (req, res, next) => {

  let requiredFields = ['id', 'name'];

  for ( let i = 0; i < requiredFields.length; i ++){
    let currentField = requiredFields[i];

    if (! (currentField in req.body)){
      res.status(406).json({
        message : `Missing field ${currentField} in body.`,
        status : 406
      });
      return next();
    }
  }

  bcrypt.hash(req.body.name, 10)
      .then(hashedName => {
        let objectToAdd = {
          id: req.body.id,
          name: hashedName
        };
        ListSports.post(objectToAdd)
            .then(sport => {
              res.status(201).json({
                message : "Successfully added the sport",
                status : 201,
                sport : sport
              });
            }).catch( err => {
          res.status(500).json({
            message: `Internal server error.`,
            status: 500
          });
          return next();
        });
      }).catch( err => {
    res.status(500).json({
      message: `Hash error.`,
      status: 500
    });
  });
});

router.delete('/delete-sport/:_id', (req, res, next) => {
  let postId = "postId Error";

  if (!('_id' in req.params)){
    let err = new Error("Parameter not passed correctly");
    err.code = 406;
    return next(err);
  }
  if (!('_id' in req.body)){
    let err = new Error(`Missing field id in body.`);
    err.code = 406;
    return next(err);
  }
  if (req.params.id == req.body.id){
    postId = req.params.id;
  }
  else{
    let err = new Error(`ID passed in body must match id passed in path vars`);
    err.code = 406;
    return next(err);
  }

  ListSports.delete(postId)
      .then(sport => {
        res.status(200).json({
          message : `Post with id:${postId} deleted.`,
          status : 200,
          sport: sport
        });
      }).catch( err => {
    res.status(400).json({
      message : `Post id not found.`,
      status : 400
    });
    return next();
  });
});

module.exports = router;
