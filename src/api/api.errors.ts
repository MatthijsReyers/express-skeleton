
export abstract class HttpError extends Error
{
    protected statusCode: number;
    protected errorCode: number;

    constructor(statusCode: number, errorCode: number, message: string)
    {
        super(message); 
        this.statusCode = statusCode;
        this.errorCode  = errorCode;
    }

    public getStatusCode(): number
    {
        return this.statusCode;
    }

    public getErrorCode(): number
    {
        return this.errorCode;
    }

    public getMessage(): string
    {
        return this.message;
    }
}

/**
 * ## Http403Error: No Authentication error.
 * The client has not provided any authentication and is not allowed to attempt to access the 
 * resource without it.
 * 
 * @extends HttpError
 */
export class Http401Error extends HttpError
{
    constructor(errorCode: number, message: string = 'No authentication was provided.')
    {
        super(401, errorCode, message);
    }
}

/**
 * ## Http403Error: Authentication error.
 * The client has provided authentication but is not allowed to access the resource it has 
 * requested because the authentication is not sufficient.
 * 
 * @extends HttpError
 */
export class Http403Error extends HttpError
{
    constructor(errorCode: number, message: string = 'You are not permitted to access this resource.')
    {
        super(403, errorCode, message);
    }
}

/**
 * ## Http404Error: Authentication error.
 * The client has provided authentication but is not allowed to access the resource it has 
 * requested because the authentication is not sufficient.
 * 
 * @extends HttpError
 */
export class Http404Error extends HttpError
{
    constructor(errorCode: number, message: string = 'Resource does not exist.')
    {
        super(404, errorCode, message);
    }
}

/**
 * ## Http415Error: Unsupported Media Type error.
 * The server refuses to accept the payload because the format is not supported.
 * 
 * @extends HttpError
 */
export class Http415Error extends HttpError
{
    constructor(errorCode: number, message: string = 'Media type is not supported.')
    {
        super(415, errorCode, message);
    }
}

/**
 * ## Http422Error: Unprocessable Entity error.
 * Unprocessable Entity response status code indicates that the server understands the content type
 * of the request entity, and the syntax of the request entity is correct, but it was unable to 
 * process the contained instructions.
 * 
 * @extends HttpError
 */
export class Http422Error extends HttpError
{
    constructor(message: string = 'Unprocessable Entity.')
    {
        super(422, 422, message);
    }
}

/**
 * ## Http500Error: Internal server error.
 * An internal server error has taken place, this is a last resort for when an error occurs 
 * completely unexpectedly and no more appropriate status code can be found.
 * 
 * @extends HttpError
 */
export class Http500Error extends HttpError
{
    constructor(message: string = 'Internal server error.')
    {
        super(500, 500, message);
    }
}

