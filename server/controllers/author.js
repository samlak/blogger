const fs = require('fs');
const _ = require('lodash');

const {Article} = require('../models/article');
const {Author} = require('../models/author');

const AdminController = require('../controllers/admin');

const getAuthor = async (req, res) => {
    const authors = await AdminController.listModel(Author, 0, 0);
    const authorCreated = req.flash('authorCreated');
    const authorDeleted = req.flash('authorDeleted');
    const authorUpdated = req.flash('authorUpdated');
    res.render('admin/author', {authors, authorCreated, authorDeleted, authorUpdated});
};

const editAuthor = async (req, res) => {
    const author = await AdminController.getModel(req, Author);
    const roles = [['admin', 'author'], ['Admin', 'Author']];
    if(author.name === "CastError"){
        res.render('custom/404', {url: req.url});
    }else{
        res.render('admin/editauthor', {author, roles});
    }
};

const saveAuthor = async (req, res) => {
    try {
        const validation = req.body.name === '' || req.body.email === '' || req.body.password === '' || req.body.role === '';
        if(validation){
            return res.redirect('/admin/author');
        }

        if(req.files){
            var image = req.files.picture;
            var modifiedName = new Date().getTime() + image.name ;
            var path = __dirname + '/../../public/upload/' + modifiedName;
            
            await image.mv(path);
            
            var author = new Author({
                name: req.body.name,
                email: req.body.email,
                bio: req.body.bio,
                role: req.body.role,
                password: req.body.password,
                picture: modifiedName
            });
        }else{
            var author = new Author({
                name: req.body.name,
                email: req.body.email,
                bio: req.body.bio,
                role: req.body.role,
                password: req.body.password
            });
        }

        await author.save().then((result) => {
            req.flash('authorCreated', "Author created successfully");
        }, (e) => {
            req.flash('authorCreated', "Error creating a new author");
        });
        
        res.redirect('/admin/author');
    } catch (error) {
        req.flash('authorCreated', "There is problem uploading picture");
        res.redirect('/admin/author');
    }
};

const deleteAuthor = async (req, res) => {
    await Author.findById(req.params.id).then( async (author) => {
        const editorId = '5a92b7fdcb71600d68a94093';
        if(author._id == editorId){
            req.flash('authorDeleted', "You can not delete this author");
        }else{
            const articles = await Article.find({author: author._id});
            articles.forEach(async (article) => {
                await Article.findByIdAndUpdate(
                    article._id, 
                    {$set: {author: editorId}},
                    {useFindAndModify: false}
                ).then((result) => {
                }, (error) => {
                    req.flash('authorDeleted', "Error encounter when updating associated article");
                });
            });
            
            if(typeof author.picture != 'undefined' && author.picture != ''){
                fs.unlinkSync(__dirname + '/../../public/upload/' + author.picture);
            }

            await Author.findByIdAndRemove(req.params.id, {useFindAndModify: false}).then((result) => {
                req.flash('authorDeleted', "Author deleted successfully");
            }, (e) => {
                req.flash('authorDeleted', "Error deleting your author");
            });

        }
        res.redirect('/admin/author');
    }, (error) => {
        req.flash('authorDeleted', "Error deleting your author");
        res.redirect('/admin/author');
    });

};

const updateAuthor = async (req, res) => {
    try {
        const thisAuthor = await Author.findById(req.params.id);

        const author = _.pick(req.body, ['name', 'email', 'bio', 'role', 'picture', 'password']);
        if(req.body.password){
        
            const validation = req.body.password === '';
            if(validation){
                return res.redirect('/admin/author/'+thisAuthor._id+'/edit');
            }
            author.password = req.body.password;
        }else{ 
            const validation = req.body.name === '' || req.body.email === '' || req.body.password === '' || req.body.role === '';
            if(validation){
                return res.redirect('/admin/author/'+thisAuthor._id+'/edit');
            }
            author.name = req.body.name;
            author.email = req.body.email;
            author.bio = req.body.bio;
            author.role = req.body.role;
        }

        if(req.files){
            if(typeof thisAuthor.picture != 'undefined' && thisAuthor.picture != ''){
                fs.unlinkSync(__dirname + '/../../public/upload/' + thisAuthor.picture);
            }

            const image = req.files.picture;
            const modifiedName = new Date().getTime() + image.name ;
            const path = __dirname + '/../../public/upload/' + modifiedName;

            await image.mv(path);
            author.picture = modifiedName;
        }

        await Author.findByIdAndUpdate(
            req.params.id,
            {$set: author},
            {useFindAndModify: false}
        ).then((result) => {
            req.flash('authorUpdated', "Your author has been updated successfully");
        }, (e) => {
            req.flash('authorUpdated', "Error updating your author");
        });

        res.redirect('/admin/author');
    } catch (error) {
        req.flash('authorUpdated', "There is problem updating your author image");
        res.redirect('/admin/author');
    }
};

module.exports = {getAuthor, editAuthor, saveAuthor, deleteAuthor, updateAuthor};