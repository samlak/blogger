const listModel = async (Model) => {
    try{
        const models = [];
        const model = await Model.find();
        model.forEach((cat) => {
            models.push(cat);
        });
        return models;
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

const getOverview = async (Article, Author, Category, Comment) => {
    const articles = await Article.find().countDocuments();
    const authors = await Author.find().countDocuments();
    const categories = await Category.find().countDocuments();
    const comments = await Comment.find().countDocuments();

    return {articles, authors, categories, comments};
}

module.exports = {listModel, getModel, getOverview};