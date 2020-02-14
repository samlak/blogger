require('./config/config');
const express = require('express');
const path = require('path');

var {mongoose} = require('./db/mongoose');

var {Author} = require('./models/author');
var {Article} = require('./models/article');
var {Comment} = require('./models/comment');
var {Category} = require('./models/category');

const app = express();
const port = process.env.PORT;
const publicPath = "/../../../";


app.use(express.static(path.join(__dirname, '/../public')));
app.set('view engine', 'ejs');

app.get('/test', (req, res) => {
    
var author = new Author({
    name: "Salami Haruna",
    email: "sam@lak.dev",
    bio: "The best node js guy in the town",
    _role: "5e29532f5e318b1a244495b1",
    picture: "/img/avatar.png",
    password: "qwertyui"
});

author.save().then((docs) => {
    console.log(docs);
}, (e) => {
    console.log(e);
});

});

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
    res.render('admin/category', {publicPath});
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

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})
