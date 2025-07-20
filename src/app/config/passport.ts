import bcryptjs from 'bcryptjs';
import passport from "passport";
import { Strategy as GoogleStartegy, Profile, VerifyCallback} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy} from "passport-local";

// For local credential login
passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {
        try {
            const isUserExist = await User.findOne({email});
            if(!isUserExist){
                return done("User does not exist.");
            }
            const isGoogleAuthenticated = isUserExist.auth.some(providerObjects => providerObjects.provider == "google");

            if(isGoogleAuthenticated && !isUserExist.password){
                return done(null, false, {message: "You have authenticated through Google. So if you want to login with credentilas, then first login with google and set password for your gmail."});
            }

            const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);

            if(!isPasswordMatched){
                return done(null, false, {message: "Password does not match."});
            }

            return done(null, isUserExist);
        } catch (err) {
            done(err);
        }
    })
);

// For Google oAuth
passport.use(
    new GoogleStartegy({
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    },async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) =>{
        try {
            const email = profile.emails?.[0].value;
            if(!email){
                return done(null, false, {message: "No email found!"});
            }
            let user = await User.findOne({email});
            
            if(!user){
                user = await User.create({
                    name: profile.displayName,
                    picture: profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auths: [
                        {
                            provider: "google",
                            providerId: profile.id
                        }
                    ]
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);


// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void ) => {
    done(null, user._id);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
})