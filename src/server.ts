import express from 'express';
import session from 'express-session';
import { Strategy } from 'passport-local';

var app = express();

/**
 * Session middleware, used by passport.js for keeping track of sessions.
 * TODO: provide custom session store that does not leak memmory.
 */
app.use(session({
    secret: 'PowerPointIsTuringComplete',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.get('/', (req, res) => {
    res.send('Hi there, skeleton app is online!');
});

app.listen(process.env.SKELETON_APP_PORT || 8080);
