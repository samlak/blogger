require('./config/config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
// const fileupload = require('express-fileupload');

const {mongoose} = require('./db/mongoose');

const {Author} = require('./models/author');
const {Article} = require('./models/article');
const {Comment} = require('./models/comment');
const {Category} = require('./models/category');

const adminController = require('./controllers/admin');
const publicController = require('./controllers/public');

const app = express();

const port = process.env.PORT;
const publicPath = "/../../../";

app.use(
    bodyParser.urlencoded({ extended: false }),
    cookieParser("keyboard_cat"),
    session({ 
        secret: "keyboard_cat",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    }),
    flash(),
    express.static(path.join(__dirname, '/../public')),
    // fileupload()
);

app.set('view engine', 'ejs');

// PUBLIC ROUTE
app.get('/', async (req, res) => {
    const categories = await adminController.listCategory(Category);
    const articles = await adminController.listArticle(Article);
    res.render('blog/index', {publicPath, categories, articles });
});

app.get('/trending', async(req, res) => {
    const articles = await publicController.getTrending(Article);
    res.render('blog/trending', {publicPath, articles});
});

app.get('/article/:title', (req, res) => {
    res.render('blog/article', {publicPath});
});

app.get('/category/:name', async(req, res) => {
    const name = req.params.name;
    const articles = await publicController.getArticleInCategory(name, Category, Article);
    res.render('blog/category', {publicPath, articles});
});

// ADMIN ROUTE
app.get('/admin/dashboard', async (req, res) => {
    const overview = await adminController.getOverview(Article, Author, Category, Comment);
    res.render('admin/dashboard', {publicPath, overview});
});

// Category
app.get('/admin/category', async (req, res) => {
    const categories = await adminController.listCategory(Category);
    res.render('admin/category', {
        publicPath, categories, 
        categoryCreated: req.flash('categoryCreated'),
        categoryDeleted: req.flash('categoryDeleted')
    });
});

app.post('/admin/category', async (req, res) => {
    await adminController.saveCategory(req, Category);
    res.redirect('/admin/category');
});

app.get('/admin/category/:id/edit', (req, res) => {
    res.render('admin/editcategory', {publicPath});
});

app.get('/admin/category/:id/delete', async (req, res) => {
    await adminController.deleteCategory(req, Category);
    res.redirect('/admin/category');
});

// Article
app.get('/admin/article', async (req, res) => {
    const articles = await adminController.listArticle(Article);
    res.render('admin/article', {
        publicPath, articles, 
        articleCreated: req.flash('articleCreated'),
        articleDeleted: req.flash('articleDeleted')
    });
});

app.get('/admin/article/add', async (req, res) => {
    const categories = await adminController.listCategory(Category);
    res.render('admin/addarticle', {publicPath, categories});
});

app.post('/admin/article/add', async (req, res) => {
    await adminController.saveArticle(req, Article);
    res.redirect('/admin/article');
});

app.get('/admin/article/:id/edit', (req, res) => {
    res.render('admin/editarticle', {publicPath});
});

app.get('/admin/article/:id/delete', async (req, res) => {
    await adminController.deleteArticle(req, Article);
    res.redirect('/admin/article');
});

// Author
app.get('/admin/author', async (req, res) => {
    const authors = await adminController.listAuthor(Author);
    res.render('admin/author', {
        publicPath, authors, 
        authorCreated: req.flash('authorCreated'),
        authorDeleted: req.flash('authorDeleted') 
    });
});

app.post('/admin/author', async (req, res) => {
    await adminController.saveAuthor(req, Author);
    res.redirect('/admin/author');
});

app.get('/admin/author/:id/edit', (req, res) => {
    res.render('admin/editauthor', {publicPath});
});

app.get('/admin/author/:id/delete', async (req, res) => {
    await adminController.deleteAuthor(req, Author);
    res.redirect('/admin/author');
});

app.get('/login', (req, res) => {
    res.render('admin/login', {publicPath});
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})
