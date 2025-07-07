'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { getLS, setLS, removeLS } from "@/lib/utils";
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
    getUser: () => Promise<User | null>,
    signInWithFacebook: () => Promise<void>,
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
    getUser: async () => null,
    signInWithFacebook: async () => {},
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
        console.log("=== AuthProvider: Setting up auth listener ===");
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log("Auth state change:", event, session?.user?.id);
                setUser(session?.user ?? null);
                setLS("truss_user", session?.user ?? null);
                setIsLoading(false);
            }
        );

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log("Initial session:", session?.user?.id);
            setUser(session?.user ?? null);
            setLS("truss_user", session?.user ?? null);
            setIsLoading(false);
        });

        return () => {
            console.log("Cleaning up auth subscription");
            subscription.unsubscribe();
        };
    }, [supabase.auth]);

    // Also try to load user from localStorage on initial load
    useEffect(() => {
        const savedUser = getLS("truss_user", null) as User | null;
        console.log("Saved user from localStorage:", savedUser?.id);
        if (savedUser && !user) {
            setUser(savedUser);
        }
    }, [user]);
    
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


    const signInWithFacebook = async () => {
        try {
            setIsLoading(true);
            console.log('=== Facebook OAuth Debug ===');
            console.log('Starting Facebook OAuth flow...');
            console.log('Current URL:', window.location.href);
            console.log('Redirect URL:', `${window.location.origin}/auth/callback`);
            
            // Check if we're in development mode
            console.log('Environment:', process.env.NODE_ENV);
            
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "facebook",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    scopes: 'email, public_profile', // Explicitly request email and public profile
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            
            console.log('Facebook OAuth response:', { data, error });
            
            if (error) {
                console.error('Facebook OAuth error details:', {
                    message: error.message,
                    status: error.status,
                    details: error
                });
                
                // Handle specific email permission error
                if (error.message.includes('email') || error.message.includes('external provider')) {
                    setSignInError('Facebook email access requires verification. To test immediately:\n\n1. Go to Facebook Developer Console\n2. Navigate to Roles > Test Users\n3. Create a test user\n4. Use that test account to login\n\nOr complete Business Verification in App Review > Business Verification');
                } else {
                    setSignInError(`Facebook OAuth Error: ${error.message}`);
                }
                return;
            }
            
            if (data?.url) {
                console.log('Redirecting to Facebook URL:', data.url);
                // The redirect should happen automatically
            }
            
        } catch (error) {
            console.error('Sign in error:', error);
            if (error instanceof Error && (error.message.includes('email') || error.message.includes('external provider'))) {
                setSignInError('Facebook email access is required but not available. Please:\n1. Check if you\'re added as a developer in the Facebook app\n2. Try with a test user\n3. Verify your Facebook account has a confirmed email');
            } else {
                setSignInError(error instanceof Error ? error.message : 'An unknown error occurred');
            }
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

    const getUser = async () => {
        try {
            const getUserFromLS = getLS("truss_user", null)
            if (! getUserFromLS) {
                const { data: { user } } = await supabase.auth.getUser()
                setLS("truss_user", user)
                return user
            }
            return getUserFromLS
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            removeLS("truss_user");
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, signInError, signUpError, signUpWithEmail, signInWithGoogle, signInWithEmail, signOut, setSignUpError, setSignInError, signInWithX, getUser, signInWithFacebook }}>
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