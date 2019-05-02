/* jshint esversion: 6, node : true */

const express = require('express');
const router = express.Router();
const {productDB} = require('../sources/model_product.js');

router.get('/', (req, res, next) => {
    productDB.get()
        .then(product => {
            res.status(200).json({
                message: "Successfully sent the list of products",
                status: 200,
                product: product
            });
        }).catch(err => {
        res.status(500).json({
            message: `Internal server error.`,
            status: 500
        });
        return next();
    });
});

router.get('/:category', (req, res, next) => {
    if (!('category' in req.params)) {
        let err = new Error("Parameter not passed correctly");
        err.code = 406;
        return next(err);
    }

    productDB.getFromCategory(req.params.category)
        .then(products => {
            res.status(200).json({
                message: `Successfully sent the list of products of category[\"${req.params.category}\"]`,
                status: 200,
                product: products
            });
        }).catch(err => {
        res.status(500).json({
            message: `Internal server error.`,
            status: 500
        });
        return next();
    });
});

router.post('/', (req, res, next) => {

    let requiredFields = ['productname', 'id', 'price', 'category', 'imageURL'];

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
        productname: req.body.productname,
        id: req.body.id,
        price: req.body.price,
        category: req.body.category,
        imageURL: req.body.imageURL
    };
    productDB.post(objectToAdd)
        .then(product => {
            res.status(201).json({
                message: "Successfully added the product",
                status: 201,
                product: product
            });
        }).catch(err => {
            throw new Error(err);
    });
});

router.delete('/:id', (req, res, next) => {
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
    if (req.params.id == req.body.id) {
        ID = req.params.id;
    } else {
        let err = new Error(`id passed in body must match id passed in path vars`);
        err.code = 406;
        return next(err);
    }

    productDB.delete(ID)
        .then(product => {
            res.status(200).json({
                message: `Product with ID:${ID} deleted.`,
                status: 200,
                product: product
            });
        }).catch(err => {
        res.status(400).json({
            message: `Product id not found.`,
            status: 400
        });
        return next();
    });
});

router.put('/:id', (req, res, next) => {

    if (!('id' in req.params)) {
        let err = new Error("Parameter not passed correctly");
        err.code = 406;
        return next(err);
    }

    let ID = req.params.id;

    productDB.put(ID, req.body)
        .then(product => {
            res.status(200).json({
                message: `Product successfully updated.`,
                status: 200,
                product: product
            });
        }).catch(err => {
        res.status(400).json({
            message: `Product id not found.`,
            status: 400
        });
    });
});

module.exports = router;
