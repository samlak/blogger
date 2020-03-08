const {Author} = require('../models/author');
const {Article} = require('../models/article');
const {Comment} = require('../models/comment');
const {Category} = require('../models/category');

const listModel = async (Model, resultPerPage, pageNum) => {
    try{
        if(resultPerPage == 0){
            const model = await Model.find();
            return model;
        }
        const model = await Model.find()
        .skip((resultPerPage * pageNum) - resultPerPage)
        .limit(resultPerPage);
        return model;
    }catch(error) {
        return error;
    };  
};

const getModel = async (req, Model) => {
    try{
        const model = await Model.findById(req.params.id);
        return model;
    }catch(error) {
        return error;
    };  
};

const getOverview = async (req, res) => {
    const articles = await Article.find().countDocuments();
    const authors = await Author.find().countDocuments();
    const categories = await Category.find().countDocuments();
    const comments = await Comment.find().countDocuments();

    const overview = {articles, authors, categories, comments};
    const authenticated = req.flash('authenticated')
    
    res.render('admin/dashboard', {overview, authenticated});
}

module.exports = {listModel, getModel, getOverview};