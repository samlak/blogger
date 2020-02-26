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
        const article = await Article.findOne({slug: req.params.slug}).populate('author');
        return article;
    }catch(error) {
        return error;
    };  
};

const getArticleInCategory = async (name, Category, Article) => {
    try{
        const category = await Category.findOne({name});
        const article = await Article.find({_category: category.id});
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



module.exports = {listCategory, getArticleInCategory, getTrending, getArticle}