'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// The types for the context
type AuthContextType = {
    user: User | null,
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
    user: null,
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
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Start true
    const [signUpError, setSignUpError] = useState<string | null>(null);
    const [signInError, setSignInError] = useState<string | null>(null);
    const supabase = createClient()
    const router = useRouter();

    // Listen to auth changes
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null);
                setIsLoading(false);
            }
        );

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);
    
    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
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
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            
            if (error) {
                throw error;
            } else {
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
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "twitter",
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

    const signUpWithEmail = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signUp({
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
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, signInError, signUpError, signUpWithEmail, signInWithGoogle, signInWithEmail, signOut, setSignUpError, setSignInError, signInWithX }}>
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