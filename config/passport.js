const passport = require("passport");
const googleStrategy = require("passport-google-oauth2").Strategy;

// * Models
const User = require("../models/User");

// * Setting up Passport google strategy
passport.use(
  new googleStrategy(
    {
      clientID: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/user/auth/callback`,
      passReqToCallback: true,
      proxy: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
        console.log(profile)
      try {
        let user = await User.findOne({ email: profile.email });

        if (!user) {
          if (req.session.route === "login")
            return done(null, false, {
              message: "Permission Error Register to continue.",
            });

          const { body } = req.session;

          const user = new User({
            name: profile.displayName,
            email: profile.email,
            profilePicLink: profile.picture
          });

          await user.save();
        }
        return done(null, user, { message: "Login Successfull." });
      } catch (error) {
        console.error(error);
        return done(null, false, {
          message: "Request refused. Check your inputs.",
        });
      }
    }
  )
);

// * Passport serializeUser
passport.serializeUser((participant, done) => {
  done(null, participant._id);
});

// * Passport deserializeUser
passport.deserializeUser(async (id, done) => {
  const participant = await User.findById(id).exec();
  done(null, participant);
});