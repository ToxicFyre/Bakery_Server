/* jshint esversion: 6, node : true */

const express = require('express');
const router = express.Router();
const {orderDB} = require('../sources/model_order.js');

router.get('/', (req, res, next) => {
    orderDB.get()
        .then(order => {
            res.status(200).json({
                status: 200,
                message: "Succesfully sent the list of orders",
                order: order
            });
        }).catch(err => {
            err = new Error(err);
            return next(err);
        }
    );
});

router.post('/', (req, res, next) => {

    let requiredFields = ['userID', 'id', 'selectedProducts', 'sendTime'];

    for (let i = 0; i < requiredFields.length; i++) {
        let currentField = requiredFields[i];
        if (!(currentField in req.body)) {
            res.status(406).json({
                message: `Missing field ${currentField} in body.`,
                status: 406
            });
            return next();
        }
    }

    let objectToAdd = {
        userID:     req.body.userID,
        id:         req.body.id,
        selectedProducts:   req.body.selectedProducts,
        sendTime:   req.body.sendTime
    };

    orderDB.post(objectToAdd)
        .then(order => {
            res.status(201).json({
                message: "Successfully added the order",
                status: 201,
                order: order
            });
        }).catch(err => {
        err = new Error(err);
        return next(err);
    });
});

router.delete('/one/:id', (req, res, next) => {
    let ID = "ID Error";

    if (!('id' in req.params)) {
        let err = new Error("Parameter not passed correctly");
        err.code = 406;
        return next(err);
    }
    if (!('id' in req.body)) {
        let err = new Error(`Missing field id in body.`);
        err.code = 406;
        return next(err);
    }
    if (req.params.id === req.body.id) {
        ID = req.params.id;
    } else {
        let err = new Error(`id passed in body must match id passed in path vars`);
        err.code = 406;
        return next(err);
    }

    orderDB.delete(ID)
        .then(order => {
            res.status(200).json({
                message: `Order with ID:${ID} deleted.`,
                status: 200,
                order: order
            });
        }).catch(err => {
        res.status(400).json({
            message: `Order id not found.`,
            status: 400
        });
        return next();
    });
});

router.delete('/all/', (req, res, next) => {

    orderDB.deleteAll()
        .then(order => {
            res.status(200).json({
                message: `All deleted status: ${order.ok}`,
                status: 200,
                order: order
            });
        }).catch(err => {
        res.status(400).json({
            message: `DeleteAll Error`,
            status: 400
        });
        return next();
    });
});

module.exports = router;