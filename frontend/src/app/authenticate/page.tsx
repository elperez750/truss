'use client'

import SignUp from "@/components/features/auth/SignUp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import SignIn from "@/components/features/auth/SignIn";
import { useState } from "react";

export default function AuthenticatePage() {
    const [activeTab, setActiveTab] = useState("sign-up");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSignUpSuccess = () => {
        setSuccessMessage("Account created successfully! Please sign in to continue.");
        setActiveTab("sign-in");
        // Clear message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-3xl font-bold text-primary-800">
                        Welcome to Truss
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                        Sign up or sign in to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                            {successMessage}
                        </div>
                    )}
                    
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1 mb-8">
                            <TabsTrigger
                                value="sign-up"
                                className="data-[state=active]:bg-white data-[state=active]:text-primary-800 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                            >
                                Sign Up
                            </TabsTrigger>
                            <TabsTrigger
                                value="sign-in"
                                className="data-[state=active]:bg-white data-[state=active]:text-primary-800 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                            >
                                Sign In
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="sign-up" className="mt-0">
                            <SignUp onSignUpSuccess={handleSignUpSuccess} />
                        </TabsContent>
                        <TabsContent value="sign-in" className="mt-0">
                            <SignIn />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}