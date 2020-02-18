require('./config/config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const {mongoose} = require('./db/mongoose');

const {Author} = require('./models/author');
const {Article} = require('./models/article');
const {Comment} = require('./models/comment');
const {Category} = require('./models/category');

const {saveCategory, saveArticle, saveAuthor, listCategory, listArticle, listAuthor} = require('./controllers/admin');

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

app.get('/admin/category', async (req, res) => {
    const categories = await listCategory(Category);
    res.render('admin/category', {publicPath, categories, messages: req.flash('categoryCreated') });
});

app.post('/admin/category', async (req, res) => {
    await saveCategory(req, Category);
    res.redirect('/admin/category');
});

app.get('/admin/category/:id/edit', (req, res) => {
    res.render('admin/editcategory', {publicPath});
});

app.get('/admin/article', async (req, res) => {
    const articles = await listArticle(Article);
    res.render('admin/article', {publicPath, articles, messages: req.flash('articleCreated') });
});

app.get('/admin/article/add', async (req, res) => {
    const categories = await listCategory(Category);
    res.render('admin/addarticle', {publicPath, categories});
});

app.post('/admin/article/add', async (req, res) => {
    await saveArticle(req, Article);
    res.redirect('/admin/article');
});

app.get('/admin/article/:id/edit', (req, res) => {
    res.render('admin/editarticle', {publicPath});
});

app.get('/admin/author', async (req, res) => {
    const authors = await listAuthor(Author);
    res.render('admin/author', {publicPath, authors, messages: req.flash('authorCreated') });
});

app.post('/admin/author', async (req, res) => {
    await saveAuthor(req, Author);
    res.redirect('/admin/author');
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
