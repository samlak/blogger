const saveArticle = async (req, Article) => {
    try {
        if(req.files){
            var image = req.files.image;
            var modifiedName = new Date().getTime() + image.name ;
            var path = __dirname + '/../../public/upload/' + modifiedName;
            
            await image.mv(path);
        
            var article = new Article({
                author: "5e4da886e4f93d18a024e699",
                category: req.body.category,
                title: req.body.title,
                content: req.body.content,
                image: modifiedName
            });
        }else{
            var article = new Article({
                author: "5e4da886e4f93d18a024e699",
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

const updateArticle = async (_, fs, req, Article) => {
  
    try {
        const thisArticle = await Article.findById(req.params.id);

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

    } catch (error) {
        req.flash('articleUpdated', "There is problem updating your featured image");
        console.log(error);
    }
};

module.exports = {saveArticle, deleteArticle, updateArticle};