const _ = require('lodash');

const {Author} = require('../models/author');

const login = async (req, res) => {
    try{
        const body = _.pick(req.body, ['email', 'password']);
        const author = await Author.findByCredentials(body.email, body.password);

        const authToken = await author.generateAuthToken(); 
        // req.session.authToken = authToken;
        
        res.cookie('authToken', authToken);

        req.flash('authenticated', "You have been successfully authenticated");
        res.redirect('/admin/dashboard');
    }catch(error) {
        req.flash('authenticated', "Oops! Authentication failed, check your login details or contact the Admin.");
        res.redirect('/login');
    }
}

const logout = async (req, res) => {
    try{
        const author = req.author;
        // await author.removeToken(req.session.authToken);
        // delete req.session.authToken;
        await author.removeToken(req.cookies.authToken);
        // delete req.cookies.authToken;
        res.clearCookie('authToken');

        req.flash('authenticated', "You have been logged out successfully.");
        res.redirect('/login');
    }catch(error) {
        req.flash('authenticated', "Oops! Loggging out unsuccessful");
        res.redirect('/login');
    }
}

module.exports = {login, logout}