
export class UnkownUserError extends Error
{
    constructor(message: string)
    {
        super(message);
        this.name = "UnkownUserError";
    }
}