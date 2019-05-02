/* jshint esversion: 6 */

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let productSchema = mongoose.Schema({
    productname: {type: String, required: true},
    id: {type: Number, required: true},
    price: {type: Number, required: true},
    category: {type: String, required: true},
    imageURL: {type: String, required: true},
    numSelected: {type: Number},
});

let Product = mongoose.model('product', productSchema, 'product');

const productDB = {
    // TODO: App needs:
    //  - Get product list
    //  - Add new product
    //  - Update product
    get: function () {
        return Product.find()
            .then(products => {
                return products;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    getFromCategory: function (category) {
        return Product.find({category: category})
            .then(products => {
                return products;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    post: function (newProduct) {
        return Product.create(newProduct)
            .then(product => {
                return product;
            }).catch(err => {
                throw new Error(err);
            });
    },
    delete: function (id) {
        return Product.findOneAndDelete({id: id})
            .then(product => {
                return product;
            }).catch(err => {
                throw new Error(err);
            });
    },
    put: function (ID, body) {
        let query = {'id': ID};

        console.log(body);
        return Product.findOneAndUpdate(query, body, {upsert: true, new: true})
            .then(product => {
                return product;
            }).catch(err => {
                throw new Error(err);
            });
    }
};

module.exports = {productDB};