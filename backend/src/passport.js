import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./constant.js";
import { User } from "./models/user.model.js";
const { CLIENT_ID, CLIENT_SECRET } = config;
import { utils } from "./utils/index.js";
const { generateAccessToken, generateRefreshToken } = utils;
import { sendAuthResponse } from "./utils/helper/sendAuthResponse.js";

//google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/v1/user/auth/google/callback",
      passReqToCallback: true,
      session: false,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("profile", profile);

        // Check if user already exists in the database
        let user = await User.findOne({ 
          googleId: profile.id 
        });

        // If user does not exist, create a new one
        if (!user) {
          user = new User({
            googleId: profile.id,
            fullName: profile.name.givenName,
            email: profile.emails[0].value,
            isVerified: profile.emails[0].verified,
            isLoggedIn:true
          });
          await user.save();
        }

        // Generate tokens after saving the user
        const generatedAccessToken = generateAccessToken(user); 
        const generatedRefreshToken = generateRefreshToken(user);
        if (!user.refreshToken.includes(generatedRefreshToken)) {
          user.refreshToken.push(generatedRefreshToken); 
          await user.save(); 
        }

        // Send response with the generated tokens
        return done(null, { user, accessToken: generatedAccessToken, refreshToken: generatedRefreshToken });
      } catch (error) {
        console.error("Error during Google OAuth:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize User
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export { passport };
