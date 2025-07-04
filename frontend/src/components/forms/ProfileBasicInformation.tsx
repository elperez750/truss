'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import OnboardingFormButton from "../ui/truss/OnboardingFormButton";
import { useProfile } from "@/app/context/ProfileContext";
import { useAuth } from "@/app/context/AuthContext";


// Form validation schema
const basicInfoSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phoneNumber: z.string().min(10, "Please enter a valid phone number"),
});

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;


export default function ProfileBasicInformation() {
    const { profile, updateProfile, setRole, role } = useProfile();
    const { user, getUser } = useAuth();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<BasicInfoFormData>({
        resolver: zodResolver(basicInfoSchema),
        mode: "onChange",
        defaultValues: {
            email: user?.email || "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
        },
    });



    
    useEffect(() => {
        const fetchProfile = async () => {
        const userData = await getUser()
        console.log("userData", userData)
        if (userData) { 
            updateProfile({
                email: userData.email ?? "",
                firstName: userData.user_metadata?.first_name ?? "",
                lastName: userData.user_metadata?.last_name ?? "",
                phoneNumber: userData.user_metadata?.phone_number ?? "",
            });


            setRole("client")
            console.log("role", role)
        }
        }
        fetchProfile()
    }, [])




    const onSubmit = (data: BasicInfoFormData) => {
        try {
            setIsSubmitting(true);
            
            // Update profile in local state
            updateProfile({
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
            });

            router.push("/onboarding/role/");
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen ">
            <div className="w-xl mx-auto pb-8 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md mx-auto shadow-sm border border-gray-200">
                    <CardHeader className="space-y-3 pb-8">
                        <CardTitle className="text-3xl font-bold text-center text-primary-800">
                            Basic Information
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            We need to know a bit about you to get started
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 px-8 pb-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className={`h-12 text-base border-gray-300 focus:border-primary-600 focus:ring-primary-600 ${
                                        errors.email ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''
                                    }`}
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-sm text-error-600">{errors.email.message}</p>
                                )}
                            </div>

                            {/* First Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="Enter your first name"
                                    className={`h-12 text-base border-gray-300 focus:border-primary-600 focus:ring-primary-600 ${
                                        errors.firstName ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''
                                    }`}
                                    {...register("firstName")}
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-error-600">{errors.firstName.message}</p>
                                )}
                            </div>

                            {/* Last Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Enter your last name"
                                    className={`h-12 text-base border-gray-300 focus:border-primary-600 focus:ring-primary-600 ${
                                        errors.lastName ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''
                                    }`}
                                    {...register("lastName")}
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-error-600">{errors.lastName.message}</p>
                                )}
                            </div>

                            {/* Phone Number Field */}
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                                    Phone Number
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    className={`h-12 text-base border-gray-300 focus:border-primary-600 focus:ring-primary-600 ${
                                        errors.phoneNumber ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''
                                    }`}
                                    {...register("phoneNumber")}
                                />
                                {errors.phoneNumber && (
                                    <p className="text-sm text-error-600">{errors.phoneNumber.message}</p>
                                )}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex space-x-3 pt-4">
                                <OnboardingFormButton
                                        type="button"
                                        text="Back"
                                        onClick={() => router.push("/onboarding/role")}
                                        isSubmitting={isSubmitting}
                                        disabled={isSubmitting}
                                        className="flex-1 h-12 text-base font-medium border-gray-300 hover:bg-gray-50 cursor-pointer"
                                    />
                                <OnboardingFormButton
                                    type="submit"
                                    size="lg"
                                    disabled={!isValid || isSubmitting}
                                    text="Next"
                                    onClick={() => router.push("/onboarding/role")}
                                    isSubmitting={isSubmitting}
                                    className={`flex-1 h-12 text-base font-medium cursor-pointer ${
                                        isValid
                                            ? "bg-primary-600 hover:bg-primary-700 text-white"
                                            : "bg-gray-300 text-gray-500"
                                    }`}
                                />
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}