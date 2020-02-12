const express = require('express');
const path = require('path');

const app = express();

const publicPath = "/../../../";

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

app.get('/admin/user', (req, res) => {
    res.render('admin/user', {publicPath});
});

app.get('/admin/user/:id/edit', (req, res) => {
    res.render('admin/edituser', {publicPath});
});

app.listen(3000, () => {
    console.log(`Listening to port 3000`)
})
