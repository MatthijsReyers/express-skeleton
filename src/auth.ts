/**
 * This module contains all the setup for setting up the passport.js based 
 * login/registration system with the passport-local strategy.
 * @module auth
 */

import passport from 'passport';
import { Strategy } from 'passport-local';
import { Request, Response } from 'express';

passport.use(new Strategy((name, pass, cb) => {
    // users.findByUsername(username, (err, user) => {
    //     if (err) { return cb(err); }
    //     if (!user) { return cb(null, false); }
    //     if (user.password != password) { return cb(null, false); }
    //     return cb(null, user);
    // });
}));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});
  
passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

/**
 * Initialize middleware: This is mostly just a wrapper around the 
 * initialization stuff from passport.js.
 */
export function initialize() {
    return [
        passport.initialize(),
        passport.session()
    ];
}

/**
 * Login middleware, calls the passport authenticate middleware.
 */
export function loginPost() {
    return passport.authenticate('local', { 
        failureRedirect: '/login' 
    });
}

/**
 * Logout middleware, logs out the logged in user and calls the next middleware.
 */
export function logoutPost() {
    return (req: Request, res: Response, next:Function) => {
        req.logout(); 
        next();
    };
}