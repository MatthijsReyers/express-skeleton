import * as db from '../../database';
import * as logging from '../../logging';
import { User } from './users.types';
import { UnkownUserError } from './users.errors';

export async function isUsernameTaken(username: string): Promise<Boolean>
{
    try {
        // Minimal user input sanitization and formating.
        const name = username.toString().toLowerCase().replace(' ', '');

        let rows = await db.query(`SELECT * FROM user WHERE username = ? LIMIT 1`, [name]);
        return (rows.length > 0);
    }
    catch (error) {
        logging.modelError('users','isUsernameTaken',error);
        return true;
    }
}

export async function getAllUsers(): Promise<UserModel[]>
{
    let rows: any[] = await db.query(`SELECT * FROM user`);
    return rows.map(row => new UserModel(row));
}

export async function getUserByName(username: string): Promise<UserModel>
{
    // Minimal user input sanitization and formating.
    const name = username.toString().toLowerCase().replace(' ', '');

    let rows = await db.query(`SELECT * FROM user WHERE username = ? LIMIT 1`, [name]);
    if (rows.length === 0)
        throw new UnkownUserError(`No user with name: '${name}'`);
    return new UserModel(rows[0]);
}

export async function getUserByID(id: number|BigInt): Promise<UserModel>
{
    let rows = await db.query(`SELECT * FROM user WHERE id = ? LIMIT 1`, [id]);
    if (rows.length === 0)
        throw new UnkownUserError(`No user with id: ${id}`);
    return new UserModel(rows[0]);
}

export async function createUser(username: string, displayname: string, passhash: string)
{
    let result = await db.query(`INSERT INTO user(username, displayname, passhash) VALUES(?,?,?)`, [username,displayname,passhash]);
    return await getUserByID(result.insertId);
}

export class UserModel implements User
{
    id: number;
    username: string;
    displayname: string;
    passwordHash: string;
    
    registered: Date;
    isAdmin: boolean;

    constructor(rawDatabaseRow: any)
    {
        // There is really no way this could be triggered, but check it just in case.
        if (!rawDatabaseRow)
            throw new Error('Cannot create user object from empty data');

        this.id = rawDatabaseRow['id'];
        this.username = rawDatabaseRow['username'];
        this.displayname = rawDatabaseRow['displayname'];
        this.passwordHash = rawDatabaseRow['passhash'];
        this.registered = new Date(rawDatabaseRow['joined_on']);
        this.isAdmin = rawDatabaseRow['is_admin'];
    }

    toJson(): User
    {
        return {
            'id': this.id,
            'username': this.username,
            'displayname': this.displayname,
            'registered': this.registered,
            'isAdmin': this.isAdmin
        };
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
            this.username = name;
            return this;
        }
        catch (error) {
            logging.modelError('users','setUsername',error);
        }
    }

    async setDisplayname(name: string)
    {
        try {
            await db.query(`UPDATE user SET displayname = ? WHERE id = ?`, [name, this.id]);
            this.displayname = name;
            return this;
        }
        catch (error) {
            logging.modelError('users','setDisplayname',error);
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