import bcrypt from 'bcrypt';
import express from 'express';
import { Request, Response } from 'express';

import * as auth from './../../auth';
import * as logging from './../../logging';
import * as users from './users.model';
import { UserModel } from './users.model';
import { MESSAGE_403, MESSAGE_422_INTEGER } from './../api.messages';

/**
 * Utility middleware that checks if the user is requesting data that they may
 * actually access. (Regular users may only access their own id).
 */
async function accessCheck(req: Request, res: Response, next: Function)
{
    try {
        const uid = Number.parseInt(req.params['uid'], 10);
        const user = <UserModel>req.user;

        // Check if provided uid was actually a valid integer.
        if (isNaN(uid) || (uid < 1))
            res.status(422).send(MESSAGE_422_INTEGER);
        
        // Users can access their own data & Admins can access all data.
        else if (user.id === uid || user.isAdmin)
            next();
        
        else {
            logging.apiWarn('users','accessCheck',`Access violation by user: ${user.id}`);
            res.status(403).send(MESSAGE_403);
        }
    }

    catch (error) {logging.apiError('users', 'checkIsAdmin', error);}
}

/**
 * Utility middleware that checks if the requesting user is and admin.
 */
async function adminCheck(req: Request, res: Response, next: Function)
{
    try {
        const user = (<UserModel>req.user);
        if (user.isAdmin) next();
        else {
            logging.apiWarn('users','adminCheck',`Access violation by user: ${user.id}`);
            res.status(403).send(MESSAGE_403);
        }
    }
    catch (error) {logging.apiError('users', 'adminCheck', error);}
}

export var api = express();

api.get('/', adminCheck, async (req, res) => {
    const models: UserModel[] = await users.getAllUsers();
    res.json(models.map(model => model.toJson()));
});

api.get('/:uid', accessCheck, async (req, res) => {
    const uid = Number.parseInt(req.params['uid'], 10);
    const user = await users.getUserByID(uid);
    return res.json(user.toJson());
});

api.delete('/:ui', accessCheck, async (req, res) => {
    const uid = Number.parseInt(req.params['uid'], 10);
    const user = await users.getUserByID(uid);
    const valid = await auth.compareHashAndPass(''+req.body['current'], user.passwordHash);

    // Admins do not need to provide the current password.
    if (valid || (<UserModel>req.user).isAdmin) {
        user.delete();
        return res.status(204);
    }

    // User provided wrong password.
    else res.status(403).json({
        'error':'The current password was incorrect.'
    });
});

api.put('/:uid/admin', adminCheck, async (req, res) => {
    const uid = Number.parseInt(req.params['uid'], 10);
    const user = await users.getUserByID(uid);
    user.setAdmin(req.body['admin'] === true);
    return res.status(204);
});

api.put('/:uid/username', accessCheck, async (req, res) => {
    const uid = Number.parseInt(req.params['uid'], 10);
    const username = req.body['username'].toString().toLowerCase().replace(' ', '');

    if (await users.isUsernameTaken(username))
        return res.status(403).json({'error':'That username is already taken.'});

    if ((username.length < 5) || (username.length > 250))
        return res.status(403).json({'error':'That username is not valid. (Usernames must be between 5-250 characters).'});

    const user = await users.getUserByID(uid);
    user.setUsername(username);
    return res.status(204);
});

api.put('/:uid/displayname', accessCheck, async (req, res) => {
    const uid = Number.parseInt(req.params['uid'], 10);
    const displayname = req.body['displayname'].toString().trim();

    if ((displayname.length < 1))
        return res.status(403).json({'error':'A display name must be at least a character long.'});

    const user = await users.getUserByID(uid);
    user.setDisplayname(displayname);
    return res.status(204);
});

api.put('/:uid/password', accessCheck, async (req, res) => {
    const uid = Number.parseInt(req.params['uid'], 10);
    const user = await users.getUserByID(uid);
    const valid = await auth.compareHashAndPass(''+req.body['current'], user.passwordHash);

    // Admins do not need to provide the current password.
    if (valid || (<UserModel>req.user).isAdmin)
    {
        const hash = await auth.hashPassword(req.body['newpass']);
        user.setPasswordHash(hash);
        return res.status(204);
    }

    // User provided wrong password.
    else res.status(403).json({
        'error':'The current password was incorrect.'
    });
});