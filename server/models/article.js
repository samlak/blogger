const mongoose = require('mongoose');
const _ = require('lodash');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

var ArticleSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: { 
        type: String,
        slug: 'title' ,
        unique: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: false,
        trim: true
    }
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = {Article};