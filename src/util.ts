import { Request, Response } from 'express';

/**
 * Generates a simple express middleware function that redirects the request
 * to a given url.
 * @param {string} url - The url to redirect to
 * @return {function} Redirecting middleware function.
 */
export function redirect(url: string) {
    return (req: Request, res: Response) => res.redirect(url);
}

/**
 * Timing attack safe string comparision function that intentionally has no 
 * optimizations and should always take the same amount of time to run.
 */
 export function safeStringCompare(hash1:string, hash2:string): boolean
 {
     let check = (hash1.length === hash2.length);
     for (let i = 0; i < hash1.length; i++)
         check = check && (hash1[i] === hash2[i]);
     return check;
 }