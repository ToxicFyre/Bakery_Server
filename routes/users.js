/* jshint esversion: 6, node : true */

const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();
const {userDB} = require('../sources/model_user.js');

router.get('/', (req, res, next) => {
    userDB.get()
        .then(user => {
            res.status(200).json({
                message: "Successfully sent the list of users",
                status: 200,
                user: user
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

    let requiredFields = ['username', 'password'];

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
        username: req.body.username,
        password: req.body.password
    };
    userDB.post(objectToAdd)
        .then(user => {
            res.status(201).json({
                message: "Successfully added the user",
                status: 201,
                user: user
            });
        }).catch(err => {
        res.status(500).json({
            message: `Internal server error.`,
            status: 500
        });
        return next();
    });
});

router.delete('/:username', (req, res, next) => {
    let Username = "Username Error";

    if (!('username' in req.params)) {
        let err = new Error("Parameter not passed correctly");
        err.code = 406;
        return next(err);
    }
    if (!('username' in req.body)) {
        let err = new Error(`Missing field username in body.`);
        err.code = 406;
        return next(err);
    }
    if (req.params.username == req.body.username) {
        Username = req.params.username;
    } else {
        let err = new Error(`username passed in body must match username passed in path vars`);
        err.code = 406;
        return next(err);
    }

    userDB.delete(Username)
        .then(user => {
            res.status(200).json({
                message: `User with username:${Username} deleted.`,
                status: 200,
                user: user
            });
        }).catch(err => {
        res.status(400).json({
            message: `User id not found.`,
            status: 400
        });
        return next();
    });
});

router.put('/', (req, res, next) => {

    userDB.put(req.body)
        .then(user => {
            res.status(200).json({
                message: `Post successfully updated.`,
                status: 200,
                user: user
            });
        }).catch(err => {
        err = new Error(err);
        return next(err);
    });
});

router.post('/auth/', async (req, res, next) => {

    userDB.isValid(req.body.username, req.body.password)
        .then(token => {
            res.status(200).json({
                message: `User successfully authenticated.`,
                status: 200,
                token: token
            });
        }).catch(() => {
        res.status(400).json({
            message: `Username or password not found.`,
            status: 400
        });
        return next();
    });
});

router.post('/sendEmail/', async (req, res, next) => {

    validateEmail(req.body.email)
        .then(result => {
            userDB.handleEmail(req.body.email)
                .then(user => {
                    sendEmail("foo@example.com", req.body.email, user.toString())
                        .then(result => {
                            res.status(200).json({
                                message: `Email successfully sent.`,
                                status: 200,
                                user: user
                            });
                        }).catch(err => {
                        err = new Error(err);
                        return next(err);
                    });
                }).catch(err => {
                err = new Error(err);
                return next(err);
            });
        }).catch(err => {
        res.status(400).json({
            message: `Email invalid`,
            status: 400,
            error: err
        });
        err = new Error(err);
        return next(err);
    });


});

async function validateEmail(email) {
    let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (emailRegex.test(email)) {
        return true;
    } else {
        throw new Error('Email Invalid');
    }
}

async function sendEmail(sendEmail, recieveEmail, contents) {

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Fred Foo 👻" <${sendEmail}>`, // sender address
        to: recieveEmail, // list of receivers
        subject: "Hello ✔", // Subject line
        text: contents, // plain text body
        html: `<b>${contents}</b>` // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = router;
