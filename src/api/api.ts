import express from 'express';
import { Request, Response } from 'express';

import * as logging from './../logging';
import { HttpError, Http404Error, Http500Error } from './api.errors';
import {api as users} from './users/users.api';

var api = express();

api.use('/users', users);

api.use((error: Error, req: Request, res: Response, next: Function) => {

    // If no error exists, this must be a 404 situation
    if (!error) error = new Http404Error(404, `Sorry "/api${req.url}" does not exist.`);

    // If error is not of type HttpError, log whatever the error was and send a 500.
    if (!(error instanceof HttpError)) {
        logging.error(`Sending 500 error for uncaught error in API: ${error}`);
        error = new Http500Error()
    }

    let httpError: HttpError = <HttpError>error;

    res.status(httpError.getStatusCode());
    res.json({
        'http':    httpError.getStatusCode(),
        'error':   httpError.getErrorCode(),
        'message': httpError.getMessage()
    });
});
