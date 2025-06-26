'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types";

// The types for the context
type AuthContextType = {
    user: User | null,
    profile: Profile | null,
    setProfile: React.Dispatch<React.SetStateAction<Profile>>,
    isLoading: boolean,
    error: string | null,
    signInWithGoogle: () => Promise<void>,
    signInWithEmail: (email: string, password: string) => Promise<void>,
    signOut: () => Promise<void>,
}


const initialProfile: Profile = {
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    role: "client",
    createdAt: "",
}

export const AuthContext = createContext<AuthContextType>({
    user: null, //Will be null at first
    profile: initialProfile, //Will be null at first
    setProfile: () => {},
    isLoading: false,
    error: null,
    signInWithGoogle: async () => {},
    signInWithEmail: async () => {},
    signOut: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null); //Will be null at first
    const [isLoading, setIsLoading] = useState<boolean>(false); //Will be false at first
    const [error, setError] = useState<string | null>(null); //Will be null at first
    const [profile, setProfile] = useState<Profile>(initialProfile); //Will be null at first
    const supabase = createClient()


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
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    const signInWithEmail = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            
            if (error) throw error;
        } catch (error) {
            console.error('Sign in error:', error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, profile, setProfile, isLoading, error, signInWithGoogle, signInWithEmail, signOut }}>
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