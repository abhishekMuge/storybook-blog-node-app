const GoogleStrategy = require("passport-google-oauth20");
const mongoose = require("mongoose");
const keys = require("./keys");
const User = mongoose.model("user");
module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback",
        proxy: true,
      },
      (accessToken, refreshToken, profile, done) => {
          // console.log(accessToken);
          // console.log(profile._json);

        const newUser = {
          googleID: profile._json.sub,
          email: profile._json.email,
          firstname: profile._json.given_name,
          lastname: profile._json.family_name,
          avatar: profile._json.picture,
        };

        User.findOne({
          googleID: profile._json.sub,
        }).then((user) => {
          if (user) {
            done(null, user);
          } else {
            new User(newUser).save().then((user) => done(null, user));
          }
        });
      }
    ) 
  );
 
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
  User.findOne({_id : user._id, firstname: user.firstname})
  .then(user => {
    // console.log(user)
    done(null, user)})
    .catch(err => done(err));
  });

};

