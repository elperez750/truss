export type BaseProfile = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    createdAt: string;
}


export type ClientProfile = BaseProfile & {
    // Step 1
    preferredContactMethod: 'email' | 'phone' | 'text';
    clientLocation: string;
    primaryGoal: string;

}

export type ContractorProfile = BaseProfile & {
    //Step 1
    primaryTrade: string;
    baseLocation: string
    serviceArea: string;


    //Step 2
    isLicensed: boolean;
    licenseNumber?: string;
    liabilityInsurance: boolean;


    //Step 3
    specialties: string[];
    yearsExperience: number;
    emergencyService?: boolean;


    //Step 4
    businessName?: string;
    hourlyRate?: number;
    serviceFee?: number;
    availability?: 'full-time' | 'part-time' | 'project-based';


    //This will come after
    portfolio?: string[];
    certifications?: string[];



    profilePicture?: string;
    businessLogoUrl?: string;
    about?: string;

    isverified?: boolean;


}


export type Profile = ClientProfile | ContractorProfile;