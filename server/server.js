require('./config/config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const _ = require('lodash');
const fileUpload = require('express-fileupload');

const {mongoose} = require('./db/mongoose');

const {Author} = require('./models/author');
const {Article} = require('./models/article');
const {Comment} = require('./models/comment');
const {Category} = require('./models/category');

const AdminController = require('./controllers/admin');
const ArticleController = require('./controllers/article');
const AuthorController = require('./controllers/author');
const CategoryController = require('./controllers/category');
const PublicController = require('./controllers/public');

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
    fileUpload()
);

app.set('view engine', 'ejs');

// PUBLIC ROUTE
app.get('/', async (req, res) => {
    const categories = await AdminController.listModel(Category);
    const articles = await AdminController.listModel(Article);
    res.render('blog/index', {publicPath, categories, articles });
});

app.get('/trending', async(req, res) => {
    const articles = await PublicController.getTrending(Article);
    res.render('blog/trending', {publicPath, articles});
});

app.get('/article/:title', (req, res) => {
    res.render('blog/article', {publicPath});
});

app.get('/category/:name', async(req, res) => {
    const name = req.params.name;
    const articles = await PublicController.getArticleInCategory(name, Category, Article);
    res.render('blog/category', {publicPath, articles});
});

// ADMIN ROUTE
app.get('/admin/dashboard', async (req, res) => {
    const overview = await AdminController.getOverview(Article, Author, Category, Comment);
    res.render('admin/dashboard', {publicPath, overview});
});

// Category
app.get('/admin/category', async (req, res) => {
    const categories = await AdminController.listModel(Category);
    res.render('admin/category', {
        publicPath, categories, 
        categoryCreated: req.flash('categoryCreated'),
        categoryDeleted: req.flash('categoryDeleted'),
        categoryUpdated: req.flash('categoryUpdated'),
    });
});

app.post('/admin/category', async (req, res) => {
    await CategoryController.saveCategory(req, Category);
    res.redirect('/admin/category');
});

app.get('/admin/category/:id/edit', async (req, res) => {
const category = await AdminController.getModel(req, Category);
    res.render('admin/editcategory', {publicPath, category});
});

app.post('/admin/category/:id/edit', async (req, res) => {
    await CategoryController.updateCategory(_, req, Category);
    res.redirect('/admin/category');
});

app.get('/admin/category/:id/delete', async (req, res) => {
    await CategoryController.deleteCategory(req, Category);
    res.redirect('/admin/category');
});

// Article
app.get('/admin/article', async (req, res) => {
    const articles = await AdminController.listModel(Article);
    res.render('admin/article', {
        publicPath, articles, 
        articleCreated: req.flash('articleCreated'),
        articleDeleted: req.flash('articleDeleted'),
        articleUpdated: req.flash('articleUpdated')
    });
});

app.get('/admin/article/add', async (req, res) => {
    const categories = await AdminController.listModel(Category);
    res.render('admin/addarticle', {publicPath, categories});
});

app.post('/admin/article/add', async (req, res) => {
    await ArticleController.saveArticle(req, Article);
    res.redirect('/admin/article');
});

app.get('/admin/article/:id/edit', async (req, res) => {
    const categories = await AdminController.listModel(Category);
    const article = await AdminController.getModel(req, Article);
    res.render('admin/editarticle', {publicPath, article, categories});
});

app.post('/admin/article/:id/edit', async (req, res) => {
    await ArticleController.updateArticle(_, req, Article);
    res.redirect('/admin/article');
});

app.get('/admin/article/:id/delete', async (req, res) => {
    await ArticleController.deleteArticle(req, Article);
    res.redirect('/admin/article');
});

// Author
app.get('/admin/author', async (req, res) => {
    const authors = await AdminController.listModel(Author);
    res.render('admin/author', {
        publicPath, authors, 
        authorCreated: req.flash('authorCreated'),
        authorDeleted: req.flash('authorDeleted'), 
        authorUpdated: req.flash('authorUpdated')
    });
});

app.post('/admin/author', async (req, res) => {
    await AuthorController.saveAuthor(req, Author);
    
    res.redirect('/admin/author');
});

app.get('/admin/author/:id/edit', async (req, res) => {
    const author = await AdminController.getModel(req, Author);
    res.render('admin/editauthor', {publicPath, author});
});

app.post('/admin/author/:id/edit', async (req, res) => {
    await AuthorController.updateAuthor(_, req, Author);
    res.redirect('/admin/author');
});

app.get('/admin/author/:id/delete', async (req, res) => {
    await AuthorController.deleteAuthor(req, Author);
    res.redirect('/admin/author');
});



app.get('/login', (req, res) => {
    res.render('admin/login', {publicPath});
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})
