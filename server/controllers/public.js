const {Author} = require('../models/author');
const {Article} = require('../models/article');
const {Comment} = require('../models/comment');
const {Category} = require('../models/category');

const AdminController = require('../controllers/admin');

const getArticle = async (req) => {
    try{
        const article = await Article.findOne({slug: req.params.slug})
            .populate('author', 'name bio picture')
            .populate('category', 'name')
            .populate('comments', '-_id -article');
        return article;
    }catch(error) {
        return error;
    };  
};

const getArticleInCategory = async (name, resultPerPage, pageNum) => {
    try{
        if(resultPerPage == 0){
            const category = await Category.findOne({name});
            const article = await Article.findOne({category: category.id});
            return [article, category];
        }
        const category = await Category.findOne({name});
        const article = await Article.find({category: category.id})
        .skip((resultPerPage * pageNum) - resultPerPage)
        .limit(resultPerPage);
        return [article, category];
    }catch(error) {
        return error;
    };  
};

const getRelatedArticle = async (req) => {
    try{
        const article = await Article.findOne({slug: req.params.slug});
        const relatedArticles = await Article.find({
            category: article.category,
            _id: {$ne: article._id}
        }).limit(5);
        return relatedArticles;
    }catch(error) {
        return error;
    };  
};

const getTrending = async () => {
    try{
        const article = await Article.find();
        return article;
    }catch(error) {
        return error;
    };  
};

const saveComment = async (req, res) => {
    try{
        var comment = new Comment({
            email: req.body.email,
            name: req.body.name,
            comment: req.body.comment,
        });
    
        await Article.findOneAndUpdate(
            {slug: req.params.slug},
            {$push: {"comments": comment._id}},
            {useFindAndModify: false}
        );
    
        await comment.save();
        req.flash('commentPosted', "Your comment has been posted successfully");
        res.redirect('/article/'+req.params.slug);
    } catch (error){
        req.flash('commentPosted', "There is problem posting your comment");
        res.redirect('/article/'+req.params.slug);
    }
}


const loadHome = async (req, res) => {
    const resultPerPage  = 2; 
    const currentPage = req.query.page || 1;

    const categories = await AdminController.listModel(Category, 0, 0);
    const articles = await AdminController.listModel(Article, resultPerPage, currentPage);
    const totalArticle = await AdminController.listModel(Article, 0, 0);
    const numOfPage = Math.ceil(totalArticle.length / resultPerPage);
    
    res.render('blog/index', {categories, articles, numOfPage, currentPage});
};

const loadTrending = async (req, res) => {
    const articles = await getTrending();
    res.render('blog/trending', {articles});
};

const loadArticle = async (req, res) => {
    const article = await getArticle(req);
    const relatedArticles = await getRelatedArticle(req);
    const commentPosted =  req.flash('commentPosted');

    if (article){
        res.render('blog/article', {
            article, relatedArticles,
            commentPosted
        });
    }else{
        res.render('custom/404', {url: req.url});
    }
};

const loadCategory = async (req, res) => {
    const name = req.params.name;
    const resultPerPage  = 1; 
    const currentPage = req.query.page || 1;

    const articles = await getArticleInCategory(name, resultPerPage, currentPage);
    if (articles[0]){
        const totalArticle = await getArticleInCategory(name, 0, 0);
        const numOfPage = Math.ceil(totalArticle.length / resultPerPage);
        res.render('blog/category', {articles, numOfPage, currentPage});
    }else{
        res.render('custom/404', {url: req.url});
    }
};

module.exports = {loadHome, loadTrending, loadArticle, loadCategory, getArticleInCategory, getTrending, getArticle, saveComment, getRelatedArticle}