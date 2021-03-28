
import mysql from 'mysql';
import { PoolConfig, Pool, PoolConnection } from 'mysql';

var pool: Pool;
var options: PoolConfig;

export function connect(db_options: PoolConfig): void
{
    options = db_options;
    pool = mysql.createPool(options);
}

export function reconnect(): void
{
    pool = mysql.createPool(options);
}

export function getConnection(): Promise<PoolConnection>
{
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) return reject(err);
            else resolve(connection);
        });
    })
}

export function query(statement: string, data: any[] = []): Promise<any[]|any>
{
    return new Promise((resolve, reject) => {
        if (data) statement = mysql.format(statement, data);
        pool.getConnection((err, connection) => {
            if (err) return reject(err);
            else connection.query(statement, (err: any, results: any[]|any, fields: any) => {
                if (err) {
                    connection.destroy();
                    return reject(err);
                }
                else {
                    connection.release();
                    return resolve(results);
                }
            });
        });
    });
}

export function format(query: string, data: any[])
{
    return mysql.format(query, data);
}
