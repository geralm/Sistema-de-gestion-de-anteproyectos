const passport = require("passport")
const localStrategy = require("passport-local").Strategy;
const  User  = require('../models/user')

passport.use(
  new localStrategy(
    {
      usernameField: "correo",
      passwordField: "contrasenia"
    },
    async (email, password, done) => {     
      const user = await User.findOne({ correo: email });
      if (!user) {
        return done(null, false, { message: "Not User found." });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch)
        return done(null, false, { message: "Incorrect Password." });
      

      return done(null, user);
    }
  )
);

passport.serializeUser(async (user, done) => {
  try {
    done(null, user.id);
  } catch (error) {
    done(error);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean();
    done(null, user);
  } catch (error) {
    done(error);
  }
});