const {Author} = require('./../models/author');

var authenticate = (req, res, next) => {
    var token = req.session.authToken;

    Author.findByToken(token).then((author) => {
        if(!author){
            return Promise.reject();
        }
        req.author = author;
        req.token = token;
        next();
    }).catch((e) => { 
        req.flash('authenticated', "Oops! You need to login to access this page");
        res.redirect('/login');
    });
};

module.exports = {authenticate}