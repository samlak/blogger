const mongoose = require('mongoose');
const _ = require('lodash');

var CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    }
});

var Category = mongoose.model('Category', CategorySchema);

module.exports = {Category};