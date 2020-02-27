const listCategory = async (Category) => {
    try{
        const categories = [];
        const category = await Category.find();
        category.forEach((cat) => {
            categories.push(cat);
        });
        return categories;
    }catch(error) {
        return error;
    };  
};

const getArticle = async (req, Article) => {
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

const getArticleInCategory = async (name, Category, Article) => {
    try{
        const category = await Category.findOne({name});
        const article = await Article.find({category: category.id});
        return [article, category];
    }catch(error) {
        return error;
    };  
};

const getTrending = async (Article) => {
    try{
        const article = await Article.find();
        return article;
    }catch(error) {
        return error;
    };  
};

const saveComment = async (req, Comment, Article) => {
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
    } catch (error){
        req.flash('commentPosted', "There is problem posting your comment");
    }
}

module.exports = {listCategory, getArticleInCategory, getTrending, getArticle, saveComment}