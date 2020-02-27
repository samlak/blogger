const mongoose = require('mongoose');
const _ = require('lodash');
const validator = require('validator');

var CommentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not valid email'
        },
        unique: false
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    created: {
        type: Date
    }
});

CommentSchema.pre('save', function (next) {
    var comment = this;
    comment.created = new Date();
    next();
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = {Comment};