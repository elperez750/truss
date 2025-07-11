'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/app/context/AuthContext";

interface SignUpProps {
    onSignUpSuccess?: () => void;
}

export default function SignUp({ onSignUpSuccess }: SignUpProps) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const { signInWithGoogle, signUpWithEmail, isLoading, signUpError, setSignUpError, signInWithX, signInWithFacebook } = useAuth();

    useEffect(() => {
        setSignUpError(null)
    }, []);

    const validatePassword = () => {
        if (password !== confirmPassword) {
            setSignUpError("Passwords do not match")
            return false
        } else {
            return true
        }
    }

    const handleSignInWithGoogle = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Sign in error:', error);
        }
    }

    const handleSignInWithFacebook = async () => {
        try {
            await signInWithFacebook();
            console.log('Facebook sign in clicked');
        } catch (error) {
            console.error('Sign in error:', error);
        }
    }

    const handleSignUpWithX = async () => {
        try {
            await signInWithX();
        } catch (error) {
            console.error('Sign in error:', error);
        }
    }

    const handleSignUpWithEmail = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePassword()) {
            return
        }

        try {
            const success = await signUpWithEmail(email, password);
            
            if (success) {
                onSignUpSuccess?.();
            }
        } catch (error) {
            console.error('Sign up error:', error);
        }
    }

    return (
        <div className="space-y-6">
            {signUpError && (
                <div className="p-4 bg-error-50 border border-error-200 text-error-700 rounded-lg text-sm">
                    {signUpError}
                </div>
            )}
            
            <div className="space-y-3">
                <Button 
                    onClick={handleSignInWithGoogle}
                    disabled={isLoading}
                    variant="outline"
                    size="lg"
                    className="w-full h-12 text-base font-medium border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    {isLoading ? 'Signing in...' : 'Continue with Google'}
                </Button>

                {/* Facebook OAuth - Temporarily disabled due to verification requirements */}
                {/* 
                <Button 
                    onClick={handleSignInWithFacebook}
                    disabled={isLoading}
                    variant="outline"
                    size="lg"
                    className="w-full h-12 text-base font-medium border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    {isLoading ? 'Signing in...' : 'Continue with Facebook'}
                </Button>
                */}

                <Button 
                    onClick={handleSignUpWithX}
                    disabled={isLoading}
                    variant="outline"
                    size="lg"
                    className="w-full h-12 text-base font-medium border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    {isLoading ? 'Signing in...' : 'Continue with X'}
                </Button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-500 font-medium">
                        Or continue with
                    </span>
                </div>
            </div>

            <form onSubmit={handleSignUpWithEmail} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-12 text-base"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-12 text-base"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm Password
                    </Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-12 text-base"
                    />
                </div>
                <Button 
                    type="submit" 
                    size="lg"
                    className="w-full h-12 text-base font-medium bg-primary-600 hover:bg-primary-700 cursor-pointer transition-colors duration-200"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating account...' : 'Get Started'}
                </Button>
            </form>
        </div>
    )
}