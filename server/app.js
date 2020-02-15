require('./config/config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

var {mongoose} = require('./db/mongoose');

var {Author} = require('./models/author');
var {Article} = require('./models/article');
var {Comment} = require('./models/comment');
var {Category} = require('./models/category');

const app = express();

const port = process.env.PORT;
const publicPath = "/../../../";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("keyboard_cat"));
app.use(session({ 
    secret: "keyboard_cat",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(express.static(path.join(__dirname, '/../public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('blog/index', {publicPath});
});

app.get('/trending', (req, res) => {
    res.render('blog/trending', {publicPath});
});

app.get('/article/:title', (req, res) => {
    res.render('blog/article', {publicPath});
});

app.get('/category/:name', (req, res) => {
    res.render('blog/category', {publicPath});
});

app.get('/admin/dashboard', (req, res) => {
    res.render('admin/dashboard', {publicPath});
});

app.get('/admin/category', (req, res) => {
    res.render('admin/category', {publicPath,  messages: req.flash('categoryCreated') });
});

app.post('/admin/category', async (req, res) => {
    const category = new Category({
        name: req.body.name,
    });

    await category.save().then((docs) => {
        req.flash('categoryCreated', "Your category has been created successfully");
    }, (e) => {
        req.flash('categoryCreated', "There is problem creating a new category");
    });
    
    res.redirect('/admin/category');
});

app.get('/admin/category/:id/edit', (req, res) => {
    res.render('admin/editcategory', {publicPath});
});

app.get('/admin/article', (req, res) => {
    res.render('admin/article', {publicPath});
});

app.get('/admin/article/add', (req, res) => {
    res.render('admin/addarticle', {publicPath});
});

app.get('/admin/article/:id/edit', (req, res) => {
    res.render('admin/editarticle', {publicPath});
});

app.get('/admin/author', (req, res) => {
    res.render('admin/author', {publicPath});
});

app.get('/admin/author/:id/edit', (req, res) => {
    res.render('admin/editauthor', {publicPath});
});

app.get('/login', (req, res) => {
    res.render('admin/login', {publicPath});
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})
