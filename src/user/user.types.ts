
export interface User
{
    id: number;
    name: string;
    passwordHash: string;
    
    registered: Date;
    isAdmin: boolean;
}