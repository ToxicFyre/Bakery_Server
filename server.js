/* jshint esversion: 6 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const {CONNECTION_URL, PORT} = require('./config');
const app = express();

mongoose.Promise = global.Promise;
const jsonParser = bodyParser.json();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const productRouter = require('./routes/products');
const orderRouter = require('./routes/orders');

app.use('/order', jsonParser, orderRouter);
app.use('/product', jsonParser, productRouter);
app.use('/user', jsonParser, userRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use('/', jsonParser, indexRouter);
app.use(express.static(path.join(__dirname + '/public')));
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true });

//Get the default connection
let db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// start the server in the port 3000 !
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}.`);
});

module.exports = {app};
