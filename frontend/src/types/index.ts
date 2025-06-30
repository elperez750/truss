
export type User = {
    id: string;
    email: string;

}


export interface Trade {
    id: string;
    title: string;
    description: string;
    category: string;
}


export type Profile = {
    id: string;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    role: 'client' | 'contractor';
    createdAt: string;

}


export interface ClientPreferences extends Profile {
    preferredContactMethod: 'email' | 'phone' | 'text';
    location: string;
    primaryGoal: string;

}


export interface ContractorPreferences extends Profile {
    
}