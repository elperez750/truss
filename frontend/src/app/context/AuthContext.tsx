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
            const savedProfile = localStorage.getItem("truss_profile");
            const savedRole = localStorage.getItem("truss_role");
            
            console.log('savedProfile from localStorage:', savedProfile);
            console.log('savedRole from localStorage:', savedRole);
            
            if (savedProfile && savedProfile !== "null") {
                const parsedProfile = JSON.parse(savedProfile);
                console.log('parsed profile:', parsedProfile);
                setProfile(parsedProfile);
            }
            
            if (savedRole && savedRole !== "null") {
                console.log('setting role to:', savedRole);
                setRole(savedRole as "client" | "contractor");
            }
        } catch (error) {
            console.error('Error loading profile from localStorage:', error);
            // Clear corrupted data
            localStorage.removeItem("truss_profile");
            localStorage.removeItem("truss_role");
        }
    }, []);



    // Save profile to localStorage whenever it changes
    useEffect(() => {
        console.log('Profile changed, saving to localStorage:', profile);
        try {
            if (profile) {
                localStorage.setItem("truss_profile", JSON.stringify(profile));
                console.log('Profile saved to localStorage');
            } else {
                localStorage.removeItem("truss_profile");
                console.log('Profile removed from localStorage');
            }
        } catch (error) {
            console.error('Error saving profile to localStorage:', error);
        }
    }, [profile]);

    // Save role to localStorage whenever it changes
    useEffect(() => {
        console.log('Role changed, saving to localStorage:', role);
        try {
            if (role) {
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
        
        if (role === 'client') {
            setProfile((prev) => {
                const newProfile = {
                    // Default values for required fields
                    id: prev?.id || crypto.randomUUID(),
                    email: prev?.email || '',
                    firstName: prev?.firstName || '',
                    lastName: prev?.lastName || '',
                    phoneNumber: prev?.phoneNumber || '',
                    createdAt: prev?.createdAt || new Date().toISOString(),
                    role: 'client' as const,
                    preferredContactMethod: (prev as ClientProfile)?.preferredContactMethod || 'email' as const,
                    clientLocation: (prev as ClientProfile)?.clientLocation || '',
                    primaryGoal: (prev as ClientProfile)?.primaryGoal || '',
                    // Apply updates
                    ...prev,
                    ...updates,
                } as ClientProfile;
                console.log('setting new client profile:', newProfile);
                return newProfile;
            });
        }
        else if (role === 'contractor') {
            setProfile((prev) => {
                const newProfile = {
                    // Default values for required fields
                    id: prev?.id || crypto.randomUUID(),
                    email: prev?.email || '',
                    firstName: prev?.firstName || '',
                    lastName: prev?.lastName || '',
                    phoneNumber: prev?.phoneNumber || '',
                    createdAt: prev?.createdAt || new Date().toISOString(),
                    role: 'contractor' as const,
                    skills: (prev as ContractorProfile)?.skills || [],
                    hourlyRate: (prev as ContractorProfile)?.hourlyRate || 0,
                    availability: (prev as ContractorProfile)?.availability || 'project-based' as const,
                    // Apply updates
                    ...prev,
                    ...updates,
                } as ContractorProfile;
                console.log('setting new contractor profile:', newProfile);
                return newProfile;
            });
        } else {
            console.log('No role set, cannot update profile');
        }
    }


    const clearProfile = () => {
        setProfile(null);
        setRole(null);
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