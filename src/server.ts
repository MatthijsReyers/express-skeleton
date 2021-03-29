import path from 'path';
import express from 'express';
import session from 'express-session';

import * as auth from './auth';
import * as database from './database';
import * as logging from './logging';
import { UserModel } from './api/users/users.model';

var app = express();

/**
 * Initialize connection to database.
 * TODO: get folderurl from ENV variables instead of hardcoded constant.
 */
logging.initialize({
    logToFile: true,
    logFilesFolder: path.join(__dirname, './../logs'),
    logLevel: 'all'
});

/**
 * Initialize connection to database.
 * TODO: get user/pass from ENV variables instead of hardcoded constant.
 */
database.connect({
    host: '127.0.0.1',
    port: 3306,

    user: 'skeletonapp',
    password: 'REPLACE_THIS_PASS',
    database: 'skeletonapp',

    insecureAuth: false,
    multipleStatements: false,
    connectionLimit: 5
});

/**
 * Setup request body parsing middleware.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

/**
 * Session middleware, used by passport.js for keeping track of sessions.
 * TODO: provide custom session store that does not very slowly leak memmory.
 */
app.use(session({
    secret: 'PowerPointIsTuringComplete',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false 
    }
}));

/**
 * Initialize authentication related paths and middleware, note that auth.initialize 
 * is mostly just a wrapper around the initialization stuff from passport.js
 */
app.use(auth.initialize());
app.get('/logout', auth.logout());
app.post('/login', auth.loginPost());
app.post('/register', auth.registerPost());
app.get('/login', (req,res) => {
    if (req.isAuthenticated()) res.redirect('/');
    else res.sendFile(path.join(__dirname,'./../static/login.html'));
});

/**
 * Root url, sends a different page if the user is logged in, replace this with
 * your own stuff.
 */
app.get('/', (req, res) => {
    if (!req.isAuthenticated()) 
        return res.redirect('/login');
    
    let user: UserModel = <UserModel>req.user;
    res.send(`Hi ${user.username}, click here to log out: <a href="/logout">logout</a>`);
});

app.listen(process.env.SKELETON_APP_PORT || 8080);
