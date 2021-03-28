/**
 * This module contains all the setup for setting up the passport.js based 
 * login/registration system with the passport-local strategy.
 * @module auth
 */

import passport from 'passport';
import { AuthenticateOptions } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Request, Response } from 'express';

import * as users from './user/user.model';
import { UserModel } from './user/user.model';
import { UnkownUserError } from './user/user.errors';

// bcrypt module does not support es6 imports.
const bcrypt = require('bcrypt');

const SALTROUNDS = 12;
const PEPPER = 'SeCuRiTyIsHaRd';

/**
 * Authentication function
 */
passport.use(new LocalStrategy(async (name, pass, done) => {
    try {
        let user = await users.getUserByName(name);
        let result = await bcrypt.compare(pass+PEPPER, user.passwordHash);
        if (result === true) done(null, user);
        else done(new Error("Wrong password"));
    }
    catch (error) {
        return done(error);
    }
}));

passport.serializeUser(async (user: any, done: Function) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id: number, done: Function) => {
    try {
        let user = await users.getUserByID(id);
        done(null, user);
    }
    catch (error) {
        return done(error);
    }
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
        successRedirect: '/',
        failureRedirect: '/?loginfail'
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

/**
 * Register post middleware generator, automatically logs in the user after 
 * saving user registration data.
 */
export function registerPost() {
    return [async (req: Request, res: Response, next: Function) => {

            // Check if both passwords match.
            if (req.body['password'] !== req.body['passwordagain'])
                return res.redirect('/?passwordsmissmatch');

            // Minimal user input sanitization and formating.
            const username = req.body['username'].toString().toLowerCase().replace(' ', '');

            // Check if username is still free/valid.
            if (await users.isUsernameTaken(username) || (username.length < 5) || (username.length > 250))
                return res.redirect('/?usernametaken');

            // Hash pass and create user.
            const passhash = await bcrypt.hash(req.body['password']+PEPPER, SALTROUNDS);
            users.createUser(username, passhash);

            // Go through to next login middleware.
            next();
        },
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/?loginfail'
        })
    ];
}
