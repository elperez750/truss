'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { ClientProfile, ContractorProfile, Profile, BaseProfile } from "@/types/profileTypes"; 
import { getLS, setLS, removeLS } from "@/lib/utils";

type ProfileContextType = {
    profile: Profile | null,
    role: "client" | "contractor" | null,
    updateProfile: (updates: Partial<Profile>) => void,
    clearProfile: () => void,
    setRole: (role: "client" | "contractor" | null) => void,
}

export const ProfileContext = createContext<ProfileContextType>({
    profile: null,
    role: "client",
    updateProfile: () => {},
    clearProfile: () => {},
    setRole: () => {},
});

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading: authLoading } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [role, setRole] = useState<"client" | "contractor" | null>("client");

    // // Clear profile on sign out
    // useEffect(() => {
    //     if (!user) {
    //         clearProfile();
    //     }
    // }, [user]);

    // Load profile from localStorage on initial render
    useEffect(() => {
        try {
            const savedProfile = getLS("truss_profile", null);
            const savedRole = getLS("truss_role", null);
            
            if (savedProfile && savedProfile !== "null") {
                setProfile(savedProfile);
            }
            
            if (savedRole && savedRole !== "null") {
                setRole(savedRole as "client" | "contractor");
            }
        } catch (error) { 
            console.error('Error loading profile from localStorage:', error);
            removeLS("truss_profile");
            removeLS("truss_role");
        }
    }, []);

    // Debug logging to help troubleshoot
    useEffect(() => {
        console.log("ProfileProvider - Auth state:", { user, authLoading });
        console.log("ProfileProvider - Profile state:", { profile, role });
    }, [user, authLoading, profile, role]);

    // Save profile to localStorage whenever it changes
    useEffect(() => {
        try {
            if (profile) {
                setLS("truss_profile", profile);
            } else {
                removeLS("truss_profile");
            }
        } catch (error) {
            console.error('Error saving profile to localStorage:', error);
        }
    }, [profile]);

    // Save role to localStorage whenever it changes
    useEffect(() => {
        try {
            if (role) {
                setLS("truss_role", role);
            } else {
                removeLS("truss_role");
            }
        } catch (error) {
            console.error('Error saving role to localStorage:', error);
        }
    }, [role]);

    const updateProfile = (updates: Partial<Profile>) => {
        console.log("updateProfile called with:", updates);
        console.log("Current user:", user);
        console.log("Current profile:", profile);
        
        const baseProfile: BaseProfile = {
            id: profile?.id || user?.id || crypto.randomUUID(),
            email: profile?.email || user?.email || '',
            firstName: profile?.firstName || user?.user_metadata?.first_name || '',
            lastName: profile?.lastName || user?.user_metadata?.last_name || '',
            phoneNumber: profile?.phoneNumber || user?.user_metadata?.phone_number || '',
            createdAt: profile?.createdAt || new Date().toISOString(),
        }

        if (!role || (role !== 'client' && role !== 'contractor')) {
            setProfile(baseProfile as Profile);
            return
        }   

        if (role === 'client') {
            setProfile((prev) => ({
                ...baseProfile,
                preferredContactMethod: (prev as ClientProfile)?.preferredContactMethod || 'email',
                clientLocation: (prev as ClientProfile)?.clientLocation || '',
                primaryGoal: (prev as ClientProfile)?.primaryGoal || '',
                ...updates,
            } as ClientProfile));
        } else if (role === 'contractor') {
            setProfile((prev) => ({
                ...baseProfile,
                primaryTrade: (prev as ContractorProfile)?.primaryTrade || '',
                baseLocation: (prev as ContractorProfile)?.baseLocation || '',
                serviceArea: (prev as ContractorProfile)?.serviceArea || '',
                businessName: (prev as ContractorProfile)?.businessName || '',
                isLicensed: (prev as ContractorProfile)?.isLicensed || false,
                licenseNumber: (prev as ContractorProfile)?.licenseNumber || '',
                liabilityInsurance: (prev as ContractorProfile)?.liabilityInsurance || false,
                specialties: (prev as ContractorProfile)?.specialties || [],
                yearsExperience: (prev as ContractorProfile)?.yearsExperience || 0,
                ...updates,
            } as ContractorProfile));
        }
    }

    const clearProfile = () => {
        setProfile(null);
        setRole("client");
        try {
            removeLS("truss_profile");
            removeLS("truss_role");
        } catch (error) {
            console.error('Error clearing profile from localStorage:', error);
        }
    }

    return (
        <ProfileContext.Provider value={{ profile, role, updateProfile, clearProfile, setRole }}>
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