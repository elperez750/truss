'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { ClientProfile, ContractorProfile, Profile, BaseProfile } from "@/types/profileTypes"; 
import { removeLS, setLS, getLS } from "@/lib/utils";



// Creating the profile context type
type ProfileContextType = {
    profile: Profile | null,
    role: "client" | "contractor" | null,
    updateProfile: (updates: Partial<Profile>) => void,
    clearProfile: () => void,
    setRole: (role: "client" | "contractor" | null) => void,
}

export const ProfileContext = createContext<ProfileContextType>({
    profile: null, // The profile data will start as null
    role: "client", // The default role will be the client  
    updateProfile: () => {}, // The updateProfile function will be empty
    clearProfile: () => {}, // The clearProfile function will be empty
    setRole: () => {}, // The setRole function will be empty
});



export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();  //We will get the logged in user from the auth context
    const [profile, setProfile] = useState<Profile | null>(null); // Here we will set the profile data to null
    const [role, setRole] = useState<"client" | "contractor" | null>("client"); // Here we will set the role to an empty string
    const [isInitialized, setIsInitialized] = useState(false);

    // Load profile and role from localStorage on mount
    useEffect(() => {
        if (isLoading) return;  

        try {
            const savedProfile = getLS("truss_profile", "");
            const savedRole = getLS("truss_role", "");

            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);
                setProfile(parsedProfile);  
            }

            if (savedRole && (savedRole === "client" || savedRole === "contractor")) {
                setRole(savedRole);
            } else {
                setRole("client"); // Default fallback
            }
        } catch (error) {
            console.error('Error loading profile from localStorage:', error);
            setRole("client"); // Default fallback
        } finally {
            setIsInitialized(true);
        }
        }, [isLoading]);

    // Save profile to localStorage whenever it changes
    useEffect(() => {
        if (!isInitialized) return;
        
        if (profile) {
            try {
                setLS("truss_profile", JSON.stringify(profile));
            } catch (error) {
                console.error('Error saving profile to localStorage:', error);
            }
        }
    }, [profile, isInitialized]);

    
    // Save role to localStorage whenever it changes
    useEffect(() => {
        if (!isInitialized) return;
        
        if (role) {
            try {
                setLS("truss_role", role);
            } catch (error) {
                console.error('Error saving role to localStorage:', error);
            }
        }
    }, [role, isInitialized]);

    const updateProfile = (updates: Partial<Profile>) => {
        console.log("updateProfile called with:", updates);
        console.log("Current user:", user);
        console.log("Current profile:", profile);
        
        // Always preserve existing base profile data first
        const baseProfile: BaseProfile = {
            id: profile?.id || user?.id || crypto.randomUUID(),
            email: profile?.email || user?.email || '',
            firstName: profile?.firstName || user?.user_metadata?.first_name || '',
            lastName: profile?.lastName || user?.user_metadata?.last_name || '',
            phoneNumber: profile?.phoneNumber || user?.user_metadata?.phone_number || '',
            createdAt: profile?.createdAt || new Date().toISOString(),
        }

        if (!role || (role !== 'client' && role !== 'contractor')) {
            const updatedProfile = {
                ...baseProfile,
                ...updates,
            } as Profile;
            setProfile(updatedProfile);
            return;
        }   

        if (role === 'client') {
            const currentClientProfile = profile as ClientProfile;
            const updatedProfile = {
                ...baseProfile,
                // Preserve existing client-specific fields
                preferredContactMethod: currentClientProfile?.preferredContactMethod || 'email',
                clientLocation: currentClientProfile?.clientLocation || '',
                primaryGoal: currentClientProfile?.primaryGoal || '',
                // Apply updates (this can override the preserved fields)
                ...updates,
            } as ClientProfile;

            setProfile(updatedProfile);
        } else if (role === 'contractor') {
            const currentContractorProfile = profile as ContractorProfile;
            const updatedProfile = {
                ...baseProfile,
                // Preserve existing contractor-specific fields
                primaryTrade: currentContractorProfile?.primaryTrade || '',
                baseLocation: currentContractorProfile?.baseLocation || '',
                serviceArea: currentContractorProfile?.serviceArea || '',
                businessName: currentContractorProfile?.businessName || '',
                isLicensed: currentContractorProfile?.isLicensed || false,
                licenseNumber: currentContractorProfile?.licenseNumber || '',
                liabilityInsurance: currentContractorProfile?.liabilityInsurance || false,
                specialties: currentContractorProfile?.specialties || [],
                yearsExperience: currentContractorProfile?.yearsExperience || 'less than 1 year',
                emergencyService: currentContractorProfile?.emergencyService || false,
                hourlyRate: currentContractorProfile?.hourlyRate,
                serviceFee: currentContractorProfile?.serviceFee,
                availability: currentContractorProfile?.availability,
                // Apply updates (this can override the preserved fields)
                ...updates,
            } as ContractorProfile;

            setProfile(updatedProfile);
        }
    }

    const clearProfile = () => {
        if (role === null) return;

        setRole("client");
        try {
            removeLS("truss_profile");
            removeLS("truss_role");
        } catch (error) {
            console.error('Error clearing profile from localStorage:', error);
        }
    }

    const handleSetRole = (newRole: "client" | "contractor" | null) => {
        setRole(newRole);
    }

    return (
        <ProfileContext.Provider value={{ 
            profile, 
            role, 
            updateProfile, 
            clearProfile, 
            setRole: handleSetRole 
        }}>
            {children}
        </ProfileContext.Provider>
    )
}

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}; 