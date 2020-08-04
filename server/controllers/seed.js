const {Author} = require('../models/author');
const {Article} = require('../models/article');
const {Comment} = require('../models/comment');
const {Category} = require('../models/category');

const articleData = require("../data/article");
const authorData = require("../data/author");
const categoryData = require("../data/category");
const commentData = require("../data/comment");

const seedToDB = async (req, res) => {
  await Author.deleteMany({}, () => {
    authorData.authors.forEach((author) => {
      new Author(author).save();
    });
  });

  await Article.deleteMany({}, () => {
    articleData.articles.forEach((article) => {
      new Article(article).save();
    });
  });

  await Comment.deleteMany({}, () => {
    commentData.comments.forEach((comment) => {
      new Comment(comment).save();
    });
  });

  await Category.deleteMany({}, () => {
    categoryData.categories.forEach((category) => {
      new Category(category).save();
    });
  });

  // Delete cookie if exist
  res.clearCookie('authToken');
  
  req.flash('seedToDB', "Data seeded into the database successfully");
  res.redirect('/');
};

module.exports = {seedToDB}