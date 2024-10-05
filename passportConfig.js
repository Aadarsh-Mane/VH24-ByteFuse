import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./models/user.js";
import jwt from "jsonwebtoken";
const SECRET = "VCET";
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "632690962669-gsshn1v715grt1g3ff84sdr6veugd1jr.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback", // Ensure this matches your settings
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            // Initialize other fields as needed
          });
          await user.save();
        }
        const token = jwt.sign(
          { email: req.user.email, id: req.user._id },
          SECRET,
          {
            expiresIn: "30d",
          }
        );
        return done(null, user, token);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize user to save in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Pass the user to done
  } catch (err) {
    done(err, null); // Pass the error to done
  }
});

export default passport;
