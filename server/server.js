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

const {Author} = require('./models/author');
const {Article} = require('./models/article');
const {Comment} = require('./models/comment');
const {Category} = require('./models/category');
const {authenticate, status} = require('./middleware/authenticate');

const AdminController = require('./controllers/admin');
const ArticleController = require('./controllers/article');
const AuthorController = require('./controllers/author');
const CategoryController = require('./controllers/category');
const PublicController = require('./controllers/public');

const app = express();

const port = process.env.PORT;

app.use(
    bodyParser.urlencoded({ extended: false }),
    cookieParser(),
    session({ 
        secret: process.env.JWT_SECRET,
        cookie: { maxAge: 60000 },
        resave: true,
        saveUninitialized: false
    }),
    flash(),
    express.static(path.join(__dirname, '/../public')),
    fileUpload(),
);

app.use(
    function(req, res, next){
        app.locals.authentication = req.session.authToken;
        next();
    },
);

app.set('view engine', 'ejs');

app.locals.publicPath = "/../../../";

// if()

// PUBLIC ROUTE

app.get('/', async (req, res) => {
    let categories = await PublicController.listCategory(Category);
    // let categories = await AdminController.listModel(Category);
    let articles = await AdminController.listModel(Article);
    res.render('blog/index', {categories, articles});
});

app.get('/trending', async(req, res) => {
    const articles = await PublicController.getTrending(Article);
    res.render('blog/trending', {articles});
});

app.get('/article/:slug', async (req, res) => {
    const article = await PublicController.getArticle(req, Article);
    const relatedArticles = await PublicController.getRelatedArticle(req, Article);
    if (article){
        res.render('blog/article', {
            article, relatedArticles,
            commentPosted: req.flash('commentPosted')
        });
    }else{
        res.render('custom/404', {url: req.url});
    }
});

app.post('/article/:slug', async (req, res) => {
    await PublicController.saveComment(req, Comment, Article);
    res.redirect('/article/'+req.params.slug);
});

app.get('/category/:name', async(req, res) => {
    const name = req.params.name;
    const articles = await PublicController.getArticleInCategory(name, Category, Article);
    if (articles[0]){
        res.render('blog/category', {articles});
    }else{
        res.render('custom/404', {url: req.url});
    }
});

// ADMIN ROUTE

app.get('/admin/dashboard', authenticate, async (req, res) => {
    const overview = await AdminController.getOverview(Article, Author, Category, Comment);
    res.render('admin/dashboard', {overview,  authenticated: req.flash('authenticated')});
});

// Category
app.get('/admin/category', [authenticate, status], async (req, res) => {
    const categories = await AdminController.listModel(Category);
    res.render('admin/category', {
        categories, 
        categoryCreated: req.flash('categoryCreated'),
        categoryDeleted: req.flash('categoryDeleted'),
        categoryUpdated: req.flash('categoryUpdated'),
    });
});

app.post('/admin/category', [authenticate, status], async (req, res) => {
    await CategoryController.saveCategory(req, Category);
    res.redirect('/admin/category');
});

app.get('/admin/category/:id/edit', [authenticate, status], async (req, res) => {
    const category = await AdminController.getModel(req, Category);
    if(category.name === "CastError"){
        res.render('custom/404', {url: req.url});
    }else{
        res.render('admin/editcategory', {category});
    }
});

app.post('/admin/category/:id/edit', [authenticate, status], async (req, res) => {
    await CategoryController.updateCategory(_, req, Category);
    res.redirect('/admin/category');
});

app.get('/admin/category/:id/delete', [authenticate, status], async (req, res) => {
    await CategoryController.deleteCategory(req, Category, Article);
    res.redirect('/admin/category');
});

// Article
app.get('/admin/article', authenticate, async (req, res) => {
    const articles = await AdminController.listModel(Article);
    res.render('admin/article', {
        articles, 
        articleCreated: req.flash('articleCreated'),
        articleDeleted: req.flash('articleDeleted'),
        articleUpdated: req.flash('articleUpdated')
    });
});

app.get('/admin/article/add', authenticate, async (req, res) => {
    const categories = await AdminController.listModel(Category);
    res.render('admin/addarticle', {categories});
});

app.post('/admin/article/add', authenticate, async (req, res) => {
    await ArticleController.saveArticle(req, Article);
    res.redirect('/admin/article');
});

app.get('/admin/article/:id/edit', authenticate, async (req, res) => {
    const categories = await AdminController.listModel(Category);
    const article = await AdminController.getModel(req, Article);
    if(article.name === "CastError"){
        res.render('custom/404', {url: req.url});
    }else{
        res.render('admin/editarticle', {article, categories});
    }
});

app.post('/admin/article/:id/edit', authenticate, async (req, res) => {
    await ArticleController.updateArticle(_, fs, req, Article);
    res.redirect('/admin/article');
});

app.get('/admin/article/:id/delete', authenticate, async (req, res) => {
    await ArticleController.deleteArticle(req, fs, Article, Comment);
    res.redirect('/admin/article');
});

// Author
app.get('/admin/author', [authenticate, status], async (req, res) => {
    const authors = await AdminController.listModel(Author);
    res.render('admin/author', {
        authors, 
        authorCreated: req.flash('authorCreated'),
        authorDeleted: req.flash('authorDeleted'), 
        authorUpdated: req.flash('authorUpdated')
    });
});

app.post('/admin/author', [authenticate, status], async (req, res) => {
    await AuthorController.saveAuthor(req, Author);
    
    res.redirect('/admin/author');
});

app.get('/admin/author/:id/edit', [authenticate, status], async (req, res) => {
    const author = await AdminController.getModel(req, Author);
    if(author.name === "CastError"){
        res.render('custom/404', {url: req.url});
    }else{
        res.render('admin/editauthor', {author});
    }
});

app.post('/admin/author/:id/edit', [authenticate, status], async (req, res) => {
    await AuthorController.updateAuthor(_, fs, req, Author);
    res.redirect('/admin/author');
});

app.get('/admin/author/:id/delete', [authenticate, status], async (req, res) => {
    await AuthorController.deleteAuthor(req, fs, Author, Article);
    res.redirect('/admin/author');
});

app.get('/login', authenticate, (req, res) => {
    res.render('admin/login', {authenticated: req.flash('authenticated')});
});

app.post('/login', async (req, res) => {
    try{
        const body = _.pick(req.body, ['email', 'password']);
        const author = await Author.findByCredentials(body.email, body.password);

        const authToken = await author.generateAuthToken(); 
        req.session.authToken = authToken;

        req.flash('authenticated', "You have been successfully authenticated");
        res.redirect('/admin/dashboard');
    }catch(error) {
        req.flash('authenticated', "Oops! Authentication failed, check your login details or contact the Admin.");
        res.redirect('/login');
    }
});

app.post('/logout', authenticate, async (req, res) => {
    try{
        const author = req.author;
        await author.removeToken(req.session.authToken);
        delete req.session.authToken;

        req.flash('authenticated', "You have been logged out successfully.");
        res.redirect('/login');
    }catch(error) {
        req.flash('authenticated', "Oops! Loggging out unsuccessful");
        res.redirect('/login');
    }
});

app.get('/404', (req, res) => {
    res.render('custom/404', {publicPath});
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
