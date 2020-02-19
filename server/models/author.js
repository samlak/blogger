const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const AuthorSchema = new mongoose.Schema({
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
    role: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        required: true,
        trim: true
    },
    picture: {
        type: String,
        required: false,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
});

AuthorSchema.pre('save', function (next) {
    var author = this;
    if(author.isModified('password')){
        bcrypt.genSalt(10, (err,  salt) => {
            bcrypt.hash(author.password, salt, (err, hash) => {
                author.password = hash;
                next();
            });
        });
        
    }else{
        next();
    }
});

const Author = mongoose.model('Author', AuthorSchema);

module.exports = {Author};