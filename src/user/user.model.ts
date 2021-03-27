import * as db from './../database';
import { User } from "./user.types";

export async function getUserByName(username: string): Promise<UserModel>
{
    // Minimal user input sanitization and formating.
    const name = username.toString().toLowerCase().replace(' ', '');

    let rows = await db.query(`SELECT * FROM admin WHERE name = ? LIMIT 1`, [name]);
    if (rows.length === 0)
        throw Error('No user with that name');
    return new UserModel(rows[0]);
}

export async function getUserByID(id: number): Promise<UserModel>
{
    let rows = await db.query(`SELECT * FROM admin WHERE id = ? LIMIT 1`, [id]);
    if (rows.length === 0)
        throw Error('No user with that id');
    return new UserModel(rows[0]);
}

export class UserModel implements User
{
    id: number;
    username: string;
    passwordHash: string;
    
    registered: Date;
    isAdmin: boolean;

    constructor(rawDatabaseRow: any)
    {
        if (!rawDatabaseRow)
            throw Error('Cannot create user object');

        this.id = rawDatabaseRow['id'];
        this.username = rawDatabaseRow['username'];
        this.passwordHash = rawDatabaseRow['passhash'];
        this.registered = new Date(rawDatabaseRow['joined_on']);
        this.isAdmin = rawDatabaseRow['is_admin'];
    }

    async setAdmin(status: boolean)
    {
        this.isAdmin = status;
        return await db.query(`UPDATE user SET admin = ? WHERE id = ?`, [status, this.id]);
    }

    async setUsername(name: string)
    {
        this.username = name;
        return await db.query(`UPDATE user SET username = ? WHERE id = ?`, [name, this.id]);
    }

    async setPasswordHash(hash: string)
    {
        this.passwordHash = hash;
        return await db.query(`UPDATE user SET passhash = ? WHERE id = ?`, [hash, this.id]);
    }

    async delete()
    {
        return await db.query(`DELETE CASCADE user WHERE id = ${this.id} LIMIT 1`);
    }
}