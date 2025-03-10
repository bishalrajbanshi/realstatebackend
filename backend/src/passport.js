import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./constant.js";
import { User } from "./models/user.model.js";
const { CLIENT_ID, CLIENT_SECRET } = config;
import { utils } from "./utils/index.js";
const { generateAccessToken, generateRefreshToken } = utils;

// Google OAuth Strategy
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
        console.log("Google Profile:", profile);

        // Check if user exists by email
        let user = await User.findOne({ email: profile.emails[0].value });

        // If user exists and has a password, prevent Google login
        if (user && user.password) {
          return done(null, false, { message: "Please log in with email and password." });
        }

        if (!user) {
          // Create a new user if not found
          user = new User({
            googleId: profile.id,
            fullName: profile.name.givenName,
            email: profile.emails[0].value,
            isverified: true,
            isLoggedIn: true,
          });

          // Only assign mobileNumber if it exists in profile (to prevent null conflict)
          if (profile.mobileNumber) {
            user.mobileNumber = profile.mobileNumber;
          }

          await user.save();
        } else {
          // If user exists but no Google ID, update Google login details
          if (!user.googleId) {
            user.googleId = profile.id;
            user.isVerified = profile.emails[0].verified;
            await user.save();
          }
        }

        // Generate tokens
        const generatedAccessToken = generateAccessToken(user);
        const generatedRefreshToken = generateRefreshToken(user);

        // Add refresh token if it not already in user'tokens
        user.refreshToken = [generatedRefreshToken]; 
        await user.save();

        // Store refresh token in HTTP-only cookie
        req.res.cookie("refreshToken", generatedRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          path: "/api/auth/refresh",
        });

        // Return access token
        return done(null, { accessToken: generatedAccessToken });
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
