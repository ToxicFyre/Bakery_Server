/* jshint esversion: 6 */


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let orderSchema = mongoose.Schema({
    userID: {type: String, required: true},
    id: {type: String, required: true, unique: true},
    selectedProducts: [{type: mongoose.Schema.Types.Object, ref: "productSchema", required: true}],
    sendTime: {type: String, required:true}
});

let Order = mongoose.model('order', orderSchema, 'order');

const orderDB = {
    get: function () {
        return Order.find()
            .then(orders => {
                return orders;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    post: function (newOrder) {
        return Order.create(newOrder)
            .then(order => {
                return order;
            }).catch(err => {
                throw new Error(err);
            });
    },
    delete: function (id) {
        return Order.findOneAndDelete({_id: id})
            .then(order => {
                return order;
            }).catch(err => {
                throw new Error(err);
            });
    },
    deleteAll: function () {
        return Order.deleteMany({})
            .then(order => {
                return order;
            }).catch(err => {
                throw new Error(err);
            });
    },
    put: function (ID, body) {
        let query = {'id': ID};
        return Order.findOneAndUpdate(query, body, {upsert: true, new: true})
            .then(order => {
                return order;
            }).catch(err => {
                throw new Error(err);
            });
    }
};

module.exports = {orderDB};