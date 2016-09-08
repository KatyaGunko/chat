'use strict';

let express = require('express');
let http = require('http');
let path = require('path');
let errorHandler = require('express-error-handler');
let config = require('config');
let log = require('libs/log')(module);
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let routes = require('./routes/index');
let session = require('express-session');

let app = express();

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if(app.get('env') === 'development') {
    app.use(logger('dev'));
} else {
    app.use(logger('default'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session());

app.use((err, req, res, next) => {
    if(app.get('env') === 'development') {
        errorHandler = errorHandler();
        errorHandler(err, req, res, next);
    } else {
        res.send(500);
    }
});

http.createServer(app).listen(config.get('port'), () => {
    log.info(`Express server listening on port ${ config.get('port') }`)
});