export type BaseProfile = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    createdAt: string;
}


export type ClientProfile = BaseProfile & {
    preferredContactMethod: 'email' | 'phone' | 'text';
    clientLocation: string;
    primaryGoal: string;

}

export type ContractorProfile = BaseProfile & {
    skills: string[];
    hourlyRate: number;
    availability: 'full-time' | 'part-time' | 'project-based';
    portfolio?: string[];
    yearsExperience?: number;
    certifications?: string[];

}


export type Profile = ClientProfile | ContractorProfile;