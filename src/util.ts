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