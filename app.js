var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'chatLog.log', level: 'info' })
    ]
});
var indexRouter = require('./routes/index');
var botRouter = require('./routes/bot');

var categories;
var productNames;
var brands;
var products = require('./products.json');

function loadData() {
    var categoriesSet = new Set();
    var productNamesSet = new Set();
    var brandsSet = new Set();

    var numberOfProducts = Object.keys(products['ProductID']).length;
    Object.keys(products['ProductID']).forEach(function(element) {
        categoriesSet.add(products['ProductID'][element]['Category']);
        productNamesSet.add(products['ProductID'][element]['ProductName']);
        brandsSet.add(products['ProductID'][element]['Brand']);
    });
    categories = Array.from(categoriesSet);
    productNames = Array.from(productNamesSet);
    brands = Array.from(brandsSet);
}

loadData();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.use('/', indexRouter);
app.use(function (req, res, next) {
    req.categories = categories;
    req.brands = brands;
    req.productNames = productNames;
    req.products = products;
    req.logger = logger;
    next();
});
app.use('/bot', botRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    if(err) {
        logger.error(err);
        res.sendStatus(err.status || 500);
    }
});

module.exports = app;
