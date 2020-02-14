const mongoose = require('mongoose');
const _ = require('lodash');
const validator = require('validator');

var CommentSchema = new mongoose.Schema({
    _article: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not valid email'
        }
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = {Comment};