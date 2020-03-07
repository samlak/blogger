const _ = require('lodash');

const {Article} = require('../models/article');
const {Category} = require('../models/category');

const AdminController = require('../controllers/admin');

const getCategory = async (req, res) => {
    const categories = await AdminController.listModel(Category);
 
    const categoryCreated = req.flash('categoryCreated');
    const categoryDeleted = req.flash('categoryDeleted');
    const categoryUpdated = req.flash('categoryUpdated');

    res.render('admin/category', {categories, categoryCreated, categoryDeleted, categoryUpdated});
}

const editCategory = async (req, res) => {
    const category = await AdminController.getModel(req, Category);

    if(category.name === "CastError"){
        res.render('custom/404', {url: req.url});
    }else{
        res.render('admin/editcategory', {category});
    }
}

const saveCategory = async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description,
    });

    await category.save().then((result) => {
        req.flash('categoryCreated', "Your category has been created successfully");
        res.redirect('/admin/category');
    }, (error) => {
        req.flash('categoryCreated', "There is problem creating a new category");
        res.redirect('/admin/category');
    });
};

const deleteCategory = async (req, res) => {
    await Category.findById(req.params.id).then( async (result) => {
        const generalId = '5e59d6621c4a961bd4cd92ba';
        if(result._id == generalId){
            req.flash('categoryDeleted', "You can not delete this category");
        }else{
            const articles = await Article.find({category: result._id});
            if(articles.length > 0){
                for(var i = 0; i < articles.length; i++){
                    await Article.findByIdAndUpdate(
                        articles[i]._id, 
                        {$set: {category: generalId}},
                        {useFindAndModify: false}
                    ).then((result) => {
                    }, (error) => {
                        req.flash('categoryDeleted', "Error encounter when updating associated article");
                    });
                }
            }

            await Category.findByIdAndRemove(
                req.params.id,
                {useFindAndModify: false}
            ).then((result) => {
                req.flash('categoryDeleted', "Your category has been deleted successfully");
            }, (error) => {
                req.flash('categoryDeleted', "Error deleting your category");
            });
        }
        res.redirect('/admin/category');
    }, (error) => {
        req.flash('categoryDeleted', "Error deleting your category");
        res.redirect('/admin/category');
    });

};

const updateCategory = async (req, res) => {
    const category = _.pick(req.body, ['name', 'description']);
    category.name = req.body.name;
    category.description = req.body.description;

    await Category.findByIdAndUpdate(
            req.params.id,
            {$set: category},
            {useFindAndModify: false}
        ).then((result) => {
        req.flash('categoryUpdated', "Your category has been updated successfully");
        res.redirect('/admin/category');
    }, (e) => {
        req.flash('categoryUpdated', "Error updating your category");
        res.redirect('/admin/category');
    });
};


module.exports = {getCategory, editCategory, saveCategory, deleteCategory, updateCategory};