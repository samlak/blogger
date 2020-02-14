const mongoose = require('mongoose');
const _ = require('lodash');

var ArticleSchema = new mongoose.Schema({
    _author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    }
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = {Article};