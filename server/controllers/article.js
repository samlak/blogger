const fs = require('fs');
const _ = require('lodash');

const {Article} = require('../models/article');
const {Comment} = require('../models/comment');
const {Category} = require('../models/category');

const AdminController = require('../controllers/admin');

const getArticle = async (req, res) => {
    const resultPerPage  = 10; 
    const currentPage = req.query.page || 1;

    const articles = await AdminController.listModel(Article, resultPerPage, currentPage);
    const totalArticle = await AdminController.listModel(Article, 0, 0);
    const numOfPage = Math.ceil(totalArticle.length / resultPerPage);

    const articleCreated = req.flash('articleCreated');
    const articleDeleted = req.flash('articleDeleted');
    const articleUpdated = req.flash('articleUpdated');

    res.render('admin/article', {articles, articleCreated, articleDeleted, articleUpdated, numOfPage, currentPage});
}

const createArticle = async (req, res) => {
    const categories = await AdminController.listModel(Category, 0, 0);
    res.render('admin/addarticle', {categories});
}

const editArticle = async (req, res) => {
    const categories = await AdminController.listModel(Category, 0, 0);
    const article = await AdminController.getModel(req, Article);
    if(article.name === "CastError"){
        res.render('custom/404', {url: req.url});
    }else{
        res.render('admin/editarticle', {article, categories});
    }
}

const saveArticle = async (req, res) => {
    try {
        const validation = req.body.title === '' || req.body.category === '' || req.body.content === '';
        if(validation){
            return res.redirect('/admin/article/add');
        }

        if(req.files){
            var image = req.files.image;
            var modifiedName = new Date().getTime() + image.name ;
            var path = __dirname + '/../../public/upload/' + modifiedName;
            
            await image.mv(path);
        
            var article = new Article({
                author: req.author._id,
                category: req.body.category,
                title: req.body.title,
                content: req.body.content,
                image: modifiedName
            });
        }else{
            var article = new Article({
                author: req.author._id,
                category: req.body.category,
                title: req.body.title,
                content: req.body.content,
            });
        }

        await article.save().then((result) => {
            req.flash('articleCreated', "Your article has been created successfully");
        }, (e) => {
            req.flash('articleCreated', "There is problem creating a new article");
        });

        res.redirect('/admin/article');
    } catch (error) {
        req.flash('articleCreated', "There is problem uploading image for your new article");
        res.redirect('/admin/article');
    }
};

const deleteArticle = async (req, res) => {
    try{
        const article = await Article.findById(req.params.id);

        article.comments.forEach( async (comment) => {
            await Comment.findByIdAndRemove(comment, {useFindAndModify: false}).then((result) => {
            }, (e) => {
                req.flash('articleDeleted', "Error deleting the associted comment for the article");
            });
        });

        await Article.findByIdAndRemove(req.params.id, {useFindAndModify: false}).then((article) => {
            if(typeof article.image != 'undefined' && article.image != ''){
                fs.unlinkSync(__dirname + '/../../public/upload/' + article.image);
            }
            req.flash('articleDeleted', "Your article has been deleted successfully");
        }, (e) => {
            req.flash('articleDeleted', "Error deleting your article");
        });
        res.redirect('/admin/article');
    }catch(error){
        req.flash('articleDeleted', "Error deleting your article");
        res.redirect('/admin/article');
    }
};

const updateArticle = async (req, res) => {
    try {
        const thisArticle = await Article.findById(req.params.id);
        
        const validation = req.body.title === '' || req.body.category === '' || req.body.content === '';
        if(validation){
            return res.redirect('/admin/article/'+thisArticle._id+'/edit');
        }


        const article = _.pick(req.body, ['category', 'title', 'content', 'image']);
        article.category = req.body.category;
        article.title = req.body.title;
        article.content = req.body.content;


        if(req.files){
            if(typeof thisArticle.image != 'undefined' && thisArticle.image != ''){
                fs.unlinkSync(__dirname + '/../../public/upload/' + thisArticle.image);
            }

            const image = req.files.image;
            const modifiedName = new Date().getTime() + image.name ;
            const path = __dirname + '/../../public/upload/' + modifiedName;

            await image.mv(path);
            article.image = modifiedName;
        }

        await Article.findByIdAndUpdate(
            req.params.id,
            {$set: article},
            {useFindAndModify: false}
        ).then((result) => {
            req.flash('articleUpdated', "Your article has been updated successfully");
        }, (e) => {
            req.flash('articleUpdated', "Error updating your article");
        });

        res.redirect('/admin/article');
    } catch (error) {
        req.flash('articleUpdated', "There is problem updating your featured image");
        res.redirect('/admin/article');
    }
};

module.exports = {getArticle, createArticle, editArticle, saveArticle, deleteArticle, updateArticle};