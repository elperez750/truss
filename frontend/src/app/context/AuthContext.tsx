'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {  ClientProfile, ContractorProfile, Profile, BaseProfile } from "@/types/profileTypes"; 
import { useRouter } from "next/navigation";

// The types for the context
type AuthContextType = {
    user: User | null,
    profile: Profile | null,
    role: "client" | "contractor" | null,
    updateProfile: (updates: Partial<Profile>) => void,
    clearProfile: () => void,
    setRole: (role: "client" | "contractor" | null) => void,
    isLoading: boolean,
    signInError: string | null,
    signUpError: string | null,
    setSignUpError: React.Dispatch<React.SetStateAction<string | null>>,
    setSignInError: React.Dispatch<React.SetStateAction<string | null>>,
    signInWithX: () => Promise<void>,
    signUpWithEmail: (email: string, password: string) => Promise<boolean>,
    signInWithGoogle: () => Promise<void>,
    signInWithEmail: (email: string, password: string) => Promise<void>,    
    signOut: () => Promise<void>,
}




    


export const AuthContext = createContext<AuthContextType>({
    user: null, //Will be null at first
    profile: null, //Will be null at first
    role: null,
    updateProfile: () => {},
    clearProfile: () => {},
    setRole: () => {},
    isLoading: false,
    signInError: null,
    signUpError: null,
    setSignUpError: () => {},
    setSignInError: () => {},
    signInWithX: async () => {},
    signUpWithEmail: async () => false,
    signInWithGoogle: async () => {},
    signInWithEmail: async () => {},
    signOut: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null); //Will be null at first
    const [isLoading, setIsLoading] = useState<boolean>(false); //Will be false at first
    const [signUpError, setSignUpError] = useState<string | null>(null); //Will be null at first
    const [signInError, setSignInError] = useState<string | null>(null); //Will be null at first
    const [profile, setProfile] = useState<Profile | null>(null); //Will be null at first
    const [role, setRole] = useState<"client" | "contractor" | null>(null);
    const supabase = createClient()
    const router = useRouter();


    // Listen to auth changes
    useEffect(() => {
        // Listen for auth changes, like if the user is logged in or out
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null);
            
                setIsLoading(false);
            }
        );



        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);



    useEffect(() => {
        console.log('Loading from localStorage...');
        try {
            // Attempt to load profile and role if they exist
            const savedProfile = localStorage.getItem("truss_profile");
            const savedRole = localStorage.getItem("truss_role");
            
            // If profile exists, parse it and set it
            if (savedProfile && savedProfile !== "null") {
                const parsedProfile = JSON.parse(savedProfile);
                console.log('parsed profile:', parsedProfile);
                setProfile(parsedProfile);
            }
            

            // If the role exists and it is not null, we can set it to the role
            if (savedRole && savedRole !== "null") {
                console.log('setting role to:', savedRole);
                setRole(savedRole as "client" | "contractor");
            }
        } catch (error) { 
            // If we do not have the profile or role, then we have corrupted data
            console.error('Error loading profile from localStorage:', error);
            // Clear corrupted data
            localStorage.removeItem("truss_profile");
            localStorage.removeItem("truss_role");
        }
    }, []);



    // Save profile to localStorage whenever it changes
    useEffect(() => {


        try {
            if (profile) {
                // We will save the profile to local storage whenevver it changes. 
                // This will be if we already have a profile, and we are updating it.
                localStorage.setItem("truss_profile", JSON.stringify(profile));
            } else {
                // If we do not have a profile, we will remove it from local storage
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
                // If the role exists and it is not null, we can set it to the role
                localStorage.setItem("truss_role", role);
                console.log('Role saved to localStorage');
            } else {
                localStorage.removeItem("truss_role");
                console.log('Role removed from localStorage');
            }
        } catch (error) {
            console.error('Error saving role to localStorage:', error);
        }
    }, [role]);


    const updateProfile = (updates: Partial<Profile>) => {
        console.log('updateProfile called with:', updates);
        console.log('current profile:', profile);
        console.log('current role:', role);


        const baseProfile: BaseProfile = {
            id: profile?.id || crypto.randomUUID(),
            email: profile?.email || '',
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            phoneNumber: profile?.phoneNumber || '',
            createdAt: profile?.createdAt || new Date().toISOString(),
        }
        
        if (role === 'client') {
            setProfile((prev) => {
                const newClientProfile = {
                    // Default values for required fields
                    ...baseProfile,

                    // Client specific fields
                    preferredContactMethod: (prev as ClientProfile)?.preferredContactMethod || 'email',
                    clientLocation: (prev as ClientProfile)?.clientLocation || '',
                    primaryGoal: (prev as ClientProfile)?.primaryGoal || '',

                    // Apply updates to the client profile
                    ...updates,
                } as ClientProfile;
                console.log('setting new client profile:', newClientProfile);
                return newClientProfile;
            });
        }
        else if (role === 'contractor') {
            setProfile((prev) => {
                const newContractorProfile = {
                    // Default values for required fields
                    ...baseProfile,

                    // Contractor specific fields
                    skills: (prev as ContractorProfile)?.skills || [],
                    hourlyRate: (prev as ContractorProfile)?.hourlyRate || 0,
                    availability: (prev as ContractorProfile)?.availability || 'project-based',

                    // Apply updates to the contractor profile
                    ...updates,
                } as ContractorProfile;
                console.log('setting new contractor profile:', newContractorProfile);
                return newContractorProfile;
            });
        } else {
            console.log('No role set, cannot update profile');
        }
    }


    const clearProfile = () => {
        setProfile(null);
        setRole(null);

        // Clear the profile and role from localStorage
        try {
            localStorage.removeItem("truss_profile");
            localStorage.removeItem("truss_role");
        } catch (error) {
            console.error('Error clearing profile from localStorage:', error);
        }
    }



    

    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            
            if (error) throw error;
        } catch (error) {
            console.error('Sign in error:', error);
            setSignInError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }


    // Sign in with email
    const signInWithEmail = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            
            if (error) {
                throw error;
            }
            else {
                router.push("/onboarding/role/")
            }
            
        } catch (error) {
            console.error('Sign in error:', error);
            setSignInError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }


    // Sign in with X
    const signInWithX = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "twitter",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
        } catch (error) {
            console.error('Sign in error:', error);
            setSignInError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }


    // Sign up with email
    const signUpWithEmail = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            
            if (error) {
                if (error.message.includes("User already registered")) {
                    setSignUpError("User already registered")
                } else {
                    setSignUpError(error instanceof Error ? error.message : 'An unknown error occurred');
                }
                return false;
            }
            
            // Clear any previous errors on success
            setSignUpError(null);
            return true;
        } catch (error) {
            console.error('Sign up error:', error);
            setSignUpError(error instanceof Error ? error.message : 'An unknown error occurred');
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    // Sign out
    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            // Clear profile data on sign out
            clearProfile();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, profile, role, updateProfile, clearProfile, setRole, isLoading, signInError, signUpError, signUpWithEmail, signInWithGoogle, signInWithEmail, signOut, setSignUpError, setSignInError, signInWithX }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};