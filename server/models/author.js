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
        lowercase: true,
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
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

AuthorSchema.methods.generateAuthToken = function(){
    var author = this;
    var access = 'auth';
    var token = jwt.sign({_id: author._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    author.tokens = author.tokens.concat([{access, token}]);
    return author.save().then(() => {
        return token;
    })
}

AuthorSchema.methods.removeToken = function(token){
    var author = this;
    return author.update({
        $pull: {
            tokens: {token}
        }
    });
}

AuthorSchema.statics.findByToken = function(token){
    var Author = this;
    var decode;
    try{
        decode = jwt.verify(token, process.env.JWT_SECRET)
    }catch(error){
        return Promise.reject();
    }

    return Author.findOne({
        '_id': decode._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

AuthorSchema.statics.findByCredentials = function(email, password) {
    var Author = this;
    return Author.findOne({email}).then((author) => {
        if(!author){
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, author.password, (err, res) => {
                if(!res){
                    return reject();
                }
                resolve(author);
            });
        });
    });
};

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

AuthorSchema.pre('findOneAndUpdate', function (next) {
    
    var password = this.getUpdate().$set.password;
    if(!password){
        return next();
    }

    try {
        bcrypt.genSalt(10, (err,  salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                this.getUpdate().$set.password = hash;
                next();
            });
        });
    }catch (error){
        return next(error);
    }
});
const Author = mongoose.model('Author', AuthorSchema);

// require ('../config/config');
// require ('../db/mongoose');
// var author = new Author({
//     name: "admin",
//     email: "admin@admin.com",
//     bio: "He is the baddes developer we ever heard",
//     role: "admin",
//     password: "password"
// });

// author.save();

module.exports = {Author};