const express = require('express');
require('dotenv').config();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const expressError = require('./utils/expressError.js')
const {tips} = require('./data/tips.js');
const {profile} = require('./data/profile.js');
const {test} = require('./data/test.js');

const app = express();
const port = process.env.PORT

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'/public')));
app.set(express.urlencoded({extended: true}));
app.engine('ejs',ejsMate);

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
    extended: true,
    }),
);

const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() * 18 * 60 * 60 * 1000,
        maxAge: 18 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

  //login logic

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.deletee = req.flash('deletee');
    res.locals.update = req.flash('update');
    res.locals.errorr = req.flash('errorr');
    res.locals.error = req.flash('error');
    res.locals.user = null;
    res.locals.isReviewAuthor = true;
    next();
});


app.get('/', (req, res)=>{
    res.send('root');
});

app.get('/home', (req, res)=>{
    res.render('home');
});

app.get('/tests', (req, res)=>{
    res.render('tests/index');
});

app.get('/tips', (req, res)=>{
    res.render('tips/index', {tips});
});

app.get('/profile', (req, res)=>{
    res.render('profile', {profile});
});

app.get('/test/:id', (req, res)=>{
    res.render('tests/test', {test});
})

app.get('/login', (req, res)=>{
    res.render('users/login');
});

app.post('/login', (req, res)=>{
    const {username, password} = req.body;
    if(username === 'admin' && password === 'password'){
        req.flash("success", `Welcome back ${req.body.username}, how's your mood today!?`);
        res.locals.user = 'admin';
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

app.get('/signup', (req, res)=>{
    res.render('users/signup');
});

app.post('/signup', (req, res)=>{
    req.flash("success", `Hi ${req.body.username}, Welcome to Trawelh!`);
    res.locals.user = req.body.username;
    res.redirect('/home');
});

app.get('/logout', (req, res)=>{
    req.session.destroy();
    res.locals.user = null;
    res.redirect('/home');
})

app.all('*', (req,res,next)=>{
    next(new expressError(404, 'page not found!'));
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong!"} = err;
    // res.status(statusCode).send(message);

    res.status(statusCode).render('error.ejs', {err});
});

app.listen(port, ()=>{
    console.log(`app listening on http://localhost:${port}`);
})