const {Author} = require('./../models/author');

const authenticate = (req, res, next) => {
    // req.session.authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTVlYzdlODM4NTA5MzE1NTAxMzg0MTIiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTgzMjc3ODIyfQ.ZqWB17nuCZT4P8uWa-rY9WW8kbDmklu_6ugtwajqI4Y";
    // var token = req.session.authToken;
    var token = req.cookies.authToken;

    if(req.url == '/login'){
        if(token){
            return res.redirect('/admin/dashboard');
        }else{
            return next();
        }
    }

    Author.findByToken(token).then((author) => {
        if(!author){
            return Promise.reject();
        }
        req.author = author;
        req.token = token;
        
        res.locals.authenticatedAuthor =  author;
        next();
    }).catch((e) => { 
        req.flash('authenticated', "Oops! You need to login to access this page");
        res.redirect('/login');
    });

};

var status = (req, res, next) => {
    // req.session.authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTVlYzdlODM4NTA5MzE1NTAxMzg0MTIiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTgzMjc3ODIyfQ.ZqWB17nuCZT4P8uWa-rY9WW8kbDmklu_6ugtwajqI4Y";
    // var token = req.session.authToken;
    var token = req.cookies.authToken;

    Author.findByToken(token).then((author) => {
        if(!author){
            return Promise.reject();
        }
        if(author.role !== "admin"){
            const message = "Your account is restricted from accessing this page. Please contact the admin to seek permission.";
            res.render('custom/error', {message});
        }else{
            next();
        }
    }).catch((e) => { 
        req.flash('authenticated', "Oops! You need to login to access this page");
        res.redirect('/login');
    });

};

module.exports = {authenticate, status}