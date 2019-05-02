/* jshint esversion: 6 */

const randomstring = require("randomstring");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
});

let User = mongoose.model('user', userSchema, 'user');

const userDB = {
    get: function () {
        return User.find()
            .then(user => {
                return user;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    post: function (newUser) {
        return User.create(newUser)
            .then(user => {
                return user;
            }).catch(err => {
                throw new Error(err);
            });
    },
    delete: function (usernamein) {
        return User.findOneAndDelete({username: usernamein})
            .then(user => {
                return user;
            }).catch(err => {
                throw new Error(err);
            });
    },
    put: function (body) {
        let query = {'_id': body._id};
        let newData = body;

        return User.findOneAndUpdate(query, newData, {upsert: true, new: true})
            .then(user => {
                return user;
            }).catch(err => {
                throw new Error(err);
            });
    },
    isValid: function (username, password) {
        return User.findOne({username: username})
            .then(user => {
                if (user === null) {
                    throw new Error();
                }
                if (password !== user.password) {
                    throw new Error();
                } else {
                    return user._id;
                }
            }).catch(err => {
                throw new Error(err);
            });
    },
    handleEmail: function (email) {
        return User.findOne({email: email})
            .then(user => {
                if (user === null) {
                    const newUser = new User({
                        username: randomstring.generate(8),
                        password: randomstring.generate(10),
                        email: email
                    });
                    return userDB.post(newUser);
                } else {
                    return user.password;
                }
            }).catch(err => {
                throw new Error(err);
            });
    }
};

module.exports = {userDB};