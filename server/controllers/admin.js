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
        description: req.body.description,
    });

    await category.save().then((result) => {
        req.flash('categoryCreated', "Your category has been created successfully");
    }, (erro) => {
        req.flash('categoryCreated', "There is problem creating a new category");
    });
};

const deleteCategory = async (req, Category) => {
    await Category.findByIdAndRemove(req.params.id).then((result) => {
        req.flash('categoryDeleted', "Your category has been deleted successfully");
    }, (erro) => {
        req.flash('categoryDeleted', "Error deleting your category");
    });
};

const listArticle = async (Article) => {
    try{
        const articles = [];
        const article = await Article.find();
        article.forEach((art) => {
            articles.push(art);
        });
        return articles;
    }catch(error) {
        return error;
    };  
};

const saveArticle = async (req, Article) => {
    const article = new Article({
        _author: "5e486243a85cc91ac0b9650b",
        _category: req.body.category,
        title: req.body.title,
        content: req.body.content,
    });

    await article.save().then((result) => {
        req.flash('articleCreated', "Your article has been created successfully");
    }, (e) => {
        req.flash('articleCreated', "There is problem creating a new article");
    });
};

const deleteArticle = async (req, Article) => {
    await Article.findByIdAndRemove(req.params.id).then((result) => {
        req.flash('articleDeleted', "Your article has been deleted successfully");
    }, (e) => {
        req.flash('articleDeleted', "Error deleting your article");
    });
};

const listAuthor = async (Author) => {
    try{
        const authors = [];
        const author = await Author.find();
        author.forEach((aut) => {
            authors.push(aut);
        });
        return authors;
    }catch(error) {
        return error;
    };  
};

const saveAuthor = async (req, Author) => {
    
    const author = new Author({
        name: req.body.name,
        email: req.body.email,
        bio: req.body.bio,
        role: req.body.role,
        password: req.body.password,
    });

    await author.save().then((result) => {
        req.flash('authorCreated', "Author created successfully");
    }, (e) => {
        req.flash('authorCreated', "Error creating a new author");
    });
};

const deleteAuthor = async (req, Author) => {
    await Author.findByIdAndRemove(req.params.id).then((result) => {
        req.flash('authorDeleted', "Author deleted successfully");
    }, (e) => {
        req.flash('authorDeleted', "Error deleting your author");
    });
};

const getOverview = async (Article, Author, Category, Comment) => {
    const articles = await Article.find().count();
    const authors = await Author.find().count();
    const categories = await Category.find().count();
    const comments = await Comment.find().count();

    return {articles, authors, categories, comments};
}

module.exports = {saveCategory, saveArticle, saveAuthor, listCategory, listArticle, listAuthor, getOverview, deleteCategory, deleteArticle, deleteAuthor};