'use client'

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useProfile } from "@/app/context/ProfileContext";


export default function SelectRole() {
    const router = useRouter();
    const { role, setRole } = useProfile();


    const handleContinue = () => {
        try {
            if (role) {
                setRole(role);
            }
            console.log("Selected role:", role);
            // Example: redirect to onboarding with role
            router.push(`/onboarding/${role}/step1`);
        } catch (error) {
            console.error("Error updating profile:", error);
        }



    };

    return (
        <div className="min-h-screen bg-white">
            <div className="w-xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md mx-auto shadow-sm border border-gray-200">
                    <CardHeader className="space-y-3 pb-8">
                        <CardTitle className="text-3xl font-bold text-center text-primary-800">
                            Choose Your Role
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Select how you'll be using Truss
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 px-8 pb-8">
                        {/* Client Option */}
                        <div 
                            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                role === "client" 
                                    ? "border-primary-600 bg-primary-50" 
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setRole("client")}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    role === "client" 
                                        ? "border-primary-600 bg-primary-600" 
                                        : "border-gray-300"
                                }`}>
                                    {role === "client" && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">I'm a Client</h3>
                                    <p className="text-sm text-gray-600">
                                        I need to hire contractors for my projects
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contractor Option */}
                        <div 
                            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                role === "contractor" 
                                    ? "border-primary-600 bg-primary-50" 
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setRole("contractor")}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    role === "contractor" 
                                        ? "border-primary-600 bg-primary-600" 
                                        : "border-gray-300"
                                }`}>
                                    {role === "contractor" && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">I'm a Contractor</h3>
                                    <p className="text-sm text-gray-600">
                                        I want to find work and connect with clients
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Continue Button */}
                        <Button 
                            onClick={handleContinue}
                            className="w-full h-12 text-base font-medium bg-secondary-500 hover:bg-secondary-700 cursor-pointer"
                            size="lg"
                        >
                            Continue as {role === "client" ? "Client" : "Contractor"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}