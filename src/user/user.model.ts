import * as db from './../database';
import * as logging from './../logging';
import { User } from './user.types';
import { UnkownUserError } from './user.errors';

export async function isUsernameTaken(username: string): Promise<Boolean>
{
    try {
        // Minimal user input sanitization and formating.
        const name = username.toString().toLowerCase().replace(' ', '');

        let rows = await db.query(`SELECT * FROM user WHERE name = ? LIMIT 1`, [name]);
        return (rows.length > 0);
    }
    catch (error) {
        logging.modelError('users','isUsernameTaken',error);
        return true;
    }
}

export async function getUserByName(username: string): Promise<UserModel>
{
    // Minimal user input sanitization and formating.
    const name = username.toString().toLowerCase().replace(' ', '');

    let rows = await db.query(`SELECT * FROM user WHERE name = ? LIMIT 1`, [name]);
    if (rows.length === 0)
        throw new UnkownUserError(`No user with name: '${name}'`);
    return new UserModel(rows[0]);
}

export async function getUserByID(id: number): Promise<UserModel>
{
    let rows = await db.query(`SELECT * FROM user WHERE id = ? LIMIT 1`, [id]);
    if (rows.length === 0)
        throw new UnkownUserError(`No user with id: ${id}`);
    return new UserModel(rows[0]);
}

export async function createUser(username: string, passhash: string)
{
    let result = await db.query(`INSERT INTO user(username, passhash) VALUES(?,?)`, [username,passhash]);
    return await getUserByID(result.insertId);
}

export class UserModel implements User
{
    id: number;
    name: string;
    passwordHash: string;
    
    registered: Date;
    isAdmin: boolean;

    constructor(rawDatabaseRow: any)
    {
        // There is really no way this could be triggered, but check it just in case.
        if (!rawDatabaseRow)
            throw new Error('Cannot create user object from empty data');

        this.id = rawDatabaseRow['id'];
        this.name = rawDatabaseRow['username'];
        this.passwordHash = rawDatabaseRow['passhash'];
        this.registered = new Date(rawDatabaseRow['joined_on']);
        this.isAdmin = rawDatabaseRow['is_admin'];
    }

    async setAdmin(status: boolean)
    {
        try {
            await db.query(`UPDATE user SET admin = ? WHERE id = ?`, [status, this.id]);
            this.isAdmin = status;
            return this;
        }
        catch (error) {
            logging.modelError('users','setAdmin',error);
        }
    }

    async setUsername(name: string)
    {
        try {
            await db.query(`UPDATE user SET username = ? WHERE id = ?`, [name, this.id]);
            this.name = name;
            return this;
        }
        catch (error) {
            logging.modelError('users','setUsername',error);
        }
    }

    async setPasswordHash(hash: string)
    {
        try {
            await db.query(`UPDATE user SET passhash = ? WHERE id = ?`, [hash, this.id]);
            this.passwordHash = hash;
            return this;
        }
        catch (error) {
            logging.modelError('users','setPasswordHash',error);
        }
    }

    async delete()
    {
        try {
            await db.query(`DELETE CASCADE user WHERE id = ${this.id} LIMIT 1`);
            return this;
        }
        catch (error) {
            logging.modelError('users','delete',error);
        }
    }
}