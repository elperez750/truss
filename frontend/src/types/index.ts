export type User = {
    id: string;
    email: string;
    userType: 'client' | 'contractor';

}


export interface Trade {
    id: string;
    title: string;
    description: string;
    category: string;
}