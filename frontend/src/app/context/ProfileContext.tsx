'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { ClientProfile, ContractorProfile, Profile, BaseProfile } from "@/types/profileTypes"; 

type ProfileContextType = {
    profile: Profile | null,
    role: "client" | "contractor",
    updateProfile: (updates: Partial<Profile>) => void,
    clearProfile: () => void,
    setRole: (role: "client" | "contractor") => void,
}

export const ProfileContext = createContext<ProfileContextType>({
    profile: null,
    role: "client",
    updateProfile: () => {},
    clearProfile: () => {},
    setRole: () => {},
});

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [role, setRole] = useState<"client" | "contractor">("client");

    // Clear profile on sign out
    useEffect(() => {
        if (!user) {
            clearProfile();
        }
    }, [user]);

    // Load profile from localStorage on initial render
    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem("truss_profile");
            const savedRole = localStorage.getItem("truss_role");
            
            if (savedProfile && savedProfile !== "null") {
                setProfile(JSON.parse(savedProfile));
            }
            
            if (savedRole && savedRole !== "null") {
                setRole(savedRole as "client" | "contractor");
            }
        } catch (error) { 
            console.error('Error loading profile from localStorage:', error);
            localStorage.removeItem("truss_profile");
            localStorage.removeItem("truss_role");
        }
    }, []);

    // Save profile to localStorage whenever it changes
    useEffect(() => {
        try {
            if (profile) {
                localStorage.setItem("truss_profile", JSON.stringify(profile));
            } else {
                localStorage.removeItem("truss_profile");
            }
        } catch (error) {
            console.error('Error saving profile to localStorage:', error);
        }
    }, [profile]);

    // Save role to localStorage whenever it changes
    useEffect(() => {
        try {
            if (role) {
                localStorage.setItem("truss_role", role);
            } else {
                localStorage.removeItem("truss_role");
            }
        } catch (error) {
            console.error('Error saving role to localStorage:', error);
        }
    }, [role]);

    const updateProfile = (updates: Partial<Profile>) => {
        const baseProfile: BaseProfile = {
            id: profile?.id || user?.id || crypto.randomUUID(),
            email: profile?.email || user?.email || '',
            firstName: profile?.firstName || user?.user_metadata?.first_name || '',
            lastName: profile?.lastName || user?.user_metadata?.last_name || '',
            phoneNumber: profile?.phoneNumber || user?.user_metadata?.phone_number || '',
            createdAt: profile?.createdAt || new Date().toISOString(),
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
            localStorage.removeItem("truss_profile");
            localStorage.removeItem("truss_role");
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