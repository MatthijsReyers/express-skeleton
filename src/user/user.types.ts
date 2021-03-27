
export interface User
{
    id: number;
    username: string;
    passwordHash: string;
    
    registered: Date;
    isAdmin: boolean;
}