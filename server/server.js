require('./config/config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const _ = require('lodash');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const {mongoose} = require('./db/mongoose');

const {authenticate, status} = require('./middleware/authenticate');

const AdminController = require('./controllers/admin');
const ArticleController = require('./controllers/article');
const AuthorController = require('./controllers/author');
const CategoryController = require('./controllers/category');
const PublicController = require('./controllers/public');
const AuthenticationController = require('./controllers/authentication');

const app = express();

const port = process.env.PORT;

app.use(
    bodyParser.urlencoded({ extended: false }),
    cookieParser(),
    session({ 
        secret: process.env.JWT_SECRET,
        cookie: { 
            maxAge: 60000,
            expires: new Date(253402300000000)
        },
        resave: true,
        saveUninitialized: false
    }),
    flash(),
    express.static(path.join(__dirname, '/../public')),
    fileUpload(),
);

app.use(
    function(req, res, next){
        // app.locals.authentication = req.session.authToken;
        app.locals.authentication = req.cookies.authToken;
        next();
    },
);

app.set('view engine', 'ejs');

app.locals.publicPath = "/../../../";

// PUBLIC ROUTE

app.get('/', async (req, res) => {
    await PublicController.loadHome(req, res);
});

app.get('/trending', async(req, res) => {
    await PublicController.loadTrending(req, res);
});

app.get('/article/:slug', async (req, res) => {
    await PublicController.loadArticle(req, res);
});

app.post('/article/:slug', async (req, res) => {
    await PublicController.saveComment(req, res);
});

app.get('/category/:name', async(req, res) => {
    await PublicController.loadCategory(req, res);
});

// ADMIN ROUTE

app.get('/admin/dashboard', authenticate, async (req, res) => {
    const overview = await AdminController.getOverview(req, res);
});

// Category
app.get('/admin/category', [authenticate, status], async (req, res) => {
    await CategoryController.getCategory(req, res);
});

app.post('/admin/category', [authenticate, status], async (req, res) => {
    await CategoryController.saveCategory(req, res);
});

app.get('/admin/category/:id/edit', [authenticate, status], async (req, res) => {    
    await CategoryController.editCategory(req, res);
});

app.post('/admin/category/:id/edit', [authenticate, status], async (req, res) => {
    await CategoryController.updateCategory(req, res);
});

app.get('/admin/category/:id/delete', [authenticate, status], async (req, res) => {
    await CategoryController.deleteCategory(req, res);
    
});

// Article
app.get('/admin/article', authenticate, async (req, res) => {
    await ArticleController.getArticle(req, res);
});

app.get('/admin/article/add', authenticate, async (req, res) => {
    await ArticleController.createArticle(req, res);
});

app.post('/admin/article/add', authenticate, async (req, res) => {
    await ArticleController.saveArticle(req, res);
});

app.get('/admin/article/:id/edit', authenticate, async (req, res) => {    
    await ArticleController.editArticle(req, res);
});

app.post('/admin/article/:id/edit', authenticate, async (req, res) => {
    await ArticleController.updateArticle(req, res);
});

app.get('/admin/article/:id/delete', authenticate, async (req, res) => {
    await ArticleController.deleteArticle(req, res);
});

// Author
app.get('/admin/author', [authenticate, status], async (req, res) => {
    await AuthorController.getAuthor(req, res);
});

app.post('/admin/author', [authenticate, status], async (req, res) => {
    await AuthorController.saveAuthor(req, res);
});

app.get('/admin/author/:id/edit', [authenticate, status], async (req, res) => {
    await AuthorController.editAuthor(req, res);
});

app.post('/admin/author/:id/edit', [authenticate, status], async (req, res) => {
    await AuthorController.updateAuthor(req, res);
});

app.get('/admin/author/:id/delete', [authenticate, status], async (req, res) => {
    await AuthorController.deleteAuthor(req, res);
});

app.get('/login', authenticate, (req, res) => {
    res.render('admin/login', {authenticated: req.flash('authenticated')});
});

app.post('/login', async (req, res) => {
    await AuthenticationController.login(req, res); 
});

app.post('/logout', authenticate, async (req, res) => {
    await AuthenticationController.logout(req, res); 
});

app.get('/404', (req, res) => {
    res.render('custom/404');
});

// app.get('/500', (req, res) => {
//     res.render('custom/500', {publicPath});
// });


app.use(
    function(req, res, next){
        res.status(404);
        res.render('custom/404', {url: req.url});
        return;
    },
);

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})
