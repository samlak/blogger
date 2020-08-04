const {Twit} = require("../models/Twit");
const {User} = require("../models/User");
const {Comment} = require("../models/Comment");

const twitData = require("../data/twits");
const userData = require("../data/users");
const commnetData = require("../data/comments");

const seedToDB = async (req, res) => {
  await User.deleteMany({}, () => {
    userData.users.forEach((user) => {
      new User(user).save();
    });
  });

  await Twit.deleteMany({}, () => {
    twitData.twits.forEach((twit) => {
      new Twit(twit).save();
    });
  });

  await Comment.deleteMany({}, () => {
    commnetData.comments.forEach((comment) => {
      new Comment(comment).save();
    });
  });

  // Delete cookie if exist
  res.clearCookie('authToken');
  
  req.flash('seedToDB', "Data seeded into the database successfully");
  res.redirect('/');
};

module.exports = {seedToDB}