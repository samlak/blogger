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

const saveCategory = async (req, Category) => {
    const category = new Category({
        name: req.body.name,
    });

    await category.save().then((result) => {
        req.flash('categoryCreated', "Your category has been created successfully");
    }, (erro) => {
        req.flash('categoryCreated', "There is problem creating a new category");
    });
};

const saveArticle = async (req, Article) => {
    const article = new Article({
        name: req.body.name,
    });

    await article.save().then((docs) => {
        req.flash('articleCreated', "Your article has been created successfully");
    }, (e) => {
        req.flash('articleCreated', "There is problem creating a new article");
    });
};

module.exports = {saveCategory, saveArticle, listCategory}