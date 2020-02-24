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

const getArticle = async (title, Article) => {
    try{
        encodeURIComponent(address)
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

module.exports = {saveCategory, saveArticle, saveAuthor, listCategory, listArticle, listAuthor, getArticleInCategory, getTrending}