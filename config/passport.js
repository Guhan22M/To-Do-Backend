const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/userModel');

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email,
                password: 'SOCIAL_LOGIN',
            });
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback',
    scope: ['user:email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: profile.displayName || profile.username,
                email,
                password: 'SOCIAL_LOGIN',
            });
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const name = `${profile.name.givenName} ${profile.name.familyName}`;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: 'SOCIAL_LOGIN',
            });
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

