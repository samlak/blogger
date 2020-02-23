const saveArticle = async (req, Article) => {
    try {
        const image = req.files.image;
        const modifiedName = new Date().getTime() + image.name ;
        const path = __dirname + '/../../public/upload/' + modifiedName;
        
        await image.mv(path);
        
        const article = new Article({
            _author: "5e4da886e4f93d18a024e699",
            _category: req.body.category,
            title: req.body.title,
            content: req.body.content,
            image: modifiedName
        });
    
        await article.save().then((result) => {
            req.flash('articleCreated', "Your article has been created successfully");
        }, (e) => {
            req.flash('articleCreated', "There is problem creating a new article");
        });

    } catch (error) {
        req.flash('articleCreated', "There is problem uploading image for your new article");
        console.log(error);
    }
};

const deleteArticle = async (req, Article) => {
    await Article.findByIdAndRemove(req.params.id).then((result) => {
        req.flash('articleDeleted', "Your article has been deleted successfully");
    }, (e) => {
        req.flash('articleDeleted', "Error deleting your article");
    });
};

const updateArticle = async (_, req, Article) => {
    const article = _.pick(req.body, ['_category', 'title', 'content']);
    article._category = req.body.category;
    article.title = req.body.title;
    article.content = req.body.content;

    await Article.findByIdAndUpdate(
            req.params.id,
            {$set: article},
            {useFindAndModify: false}
        ).then((result) => {
        req.flash('articleUpdated', "Your article has been updated successfully");
    }, (e) => {
        req.flash('articleUpdated', "Error updating your article");
    });
};

module.exports = {saveArticle, deleteArticle, updateArticle};