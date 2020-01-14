require('dotenv').config({path: __dirname + '/.env'});

console.log(__dirname)
const createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    sassMiddleware = require('node-sass-middleware'),
    compression = require('compression'),
    session = require('express-session'),
    uploadFile = require('express-fileupload'),
    app = express(),
    appRoutes = require('./routes'),
    fs = require('fs');

logger.token('date', () => {
    let p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
    return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
});

try {
    fs.mkdirSync('logs', {recursive: true})
} catch (err) {
    if (err.code !== 'EEXIST') throw err
}

try {
    fs.mkdirSync(__dirname + '/public/images/logo', {recursive: true})
} catch (err) {
    if (err.code !== 'EEXIST') throw err
}

app
.use(compression())
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.use(express.json())
.use(express.urlencoded({ extended: false }))
.use(cookieParser())
.use(sassMiddleware({
    src: path.join(__dirname, 'public/styles/scss'),
    dest: path.join(__dirname, 'public/styles/css'),
    indentedSyntax: false,
    sourceMap: false,
    outputStyle: 'compressed',
    prefix: '/styles/css',
    debug: false
}))
.use(express.static(path.join(__dirname, 'public')))
.use('/assets', [
    express.static(__dirname + '/node_modules/jquery/dist/'),
    express.static(__dirname + '/node_modules/materialize-css/dist/'),
    express.static(__dirname + '/node_modules/axios/dist/'),
])
.use(uploadFile())
.use(logger('dev', {skip: (request, response) => response.statusCode < 400}))
.use(logger('combined', {stream: fs.createWriteStream(path.join(`${__dirname}/logs`, 'access.log'), {flags: 'a'})}))
.use(session({ secret: 'topzera', proxy: true, resave: true, saveUninitialized: true }))
.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

appRoutes(app);

app
.use((req, res, next) => next(createError(404)))
.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).render('error');
});

module.exports = app;