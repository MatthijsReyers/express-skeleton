
export interface User
{
    id: number;
    username: string;
    displayname: string;
    
    registered: Date;
    isAdmin: boolean;
}