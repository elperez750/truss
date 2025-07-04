'use client'

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import OnboardingFormButton from "@/components/ui/truss/OnboardingFormButton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { ContractorProfile } from "@/types/profileTypes";
import { useRef } from "react";


// Mock data for trades and travel distances
const trades = [
    { id: "carpentry", name: "Carpentry" },
    { id: "plumbing", name: "Plumbing" },
    { id: "electrical", name: "Electrical" },
    { id: "painting", name: "Painting" },
    { id: "hvac", name: "HVAC" },
    { id: "flooring", name: "Flooring" },
    { id: "roofing", name: "Roofing" },
];

const travelDistances = [
    { id: "10", label: "Up to 10 miles" },
    { id: "25", label: "Up to 25 miles" },
    { id: "50", label: "Up to 50 miles" },
    { id: "100", label: "100+ miles" },
];

// Form validation schema
const formSchema = z.object({
    primaryTrade: z.string().min(1, "Please select your primary trade."),
    baseLocation: z.string().min(3, "Please enter a valid location."),
    travelDistance: z.string().min(1, "Please select a travel distance."),

});


type FormData = z.infer<typeof formSchema>;

export default function TradeServiceAreaForm() {
    const router = useRouter();
    const { updateProfile, profile } = useProfile();
    const { user, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading authentication...</p>
            </div>
        );
    }

    console.log("=== TradeServiceAreaForm Debug Info ===");
    console.log("Auth state:", { user, isLoading });
    console.log("User ID:", user?.id);
    console.log("User email:", user?.email);
    console.log("User metadata:", user?.user_metadata);
    console.log("Profile state:", profile);
    console.log("==========================================");

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen space-y-4">
                <p className="text-red-600">No user found - Debug Info:</p>
                <div className="bg-gray-100 p-4 rounded">
                    <p>Auth Loading: {isLoading ? 'Yes' : 'No'}</p>
                    <p>User: {user ? 'Present' : 'Null'}</p>
                    <p>Profile: {profile ? 'Present' : 'Null'}</p>
                </div>
                <button 
                    onClick={() => router.push('/authenticate')}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Go to Authentication
                </button>
            </div>
        );
    }

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            primaryTrade: (profile as ContractorProfile)?.primaryTrade ?? "",
            baseLocation: (profile as ContractorProfile)?.baseLocation ?? "",
            travelDistance: (profile as ContractorProfile)?.serviceArea ?? "",
        },  

    });

    const watchedValues = watch();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!watchedValues) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            updateProfile({
                primaryTrade: watchedValues.primaryTrade,
                baseLocation: watchedValues.baseLocation,
                serviceArea: watchedValues.travelDistance,
            });
        }, 600);
        // eslint-disable-next-line
    }, [watchedValues.primaryTrade, watchedValues.baseLocation, watchedValues.travelDistance]);

    useEffect(() => {
        if (profile) {
            reset({
                primaryTrade: (profile as ContractorProfile).primaryTrade,
                baseLocation: (profile as ContractorProfile).baseLocation,
                travelDistance: (profile as ContractorProfile).serviceArea,
            });
        }
    }, [profile, reset]);
  
    const onSubmit = (data: FormData) => {
        setIsSubmitting(true);
        console.log("Form Data:", data);
        updateProfile({
            primaryTrade: data.primaryTrade,
            baseLocation: data.baseLocation,
            serviceArea: data.travelDistance,
        });
        
        setTimeout(() => {
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-white mt-20">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary-800">
                    Your Trade & Service Area
                </CardTitle>
                <CardDescription className="text-neutral-500">
                    Tell us what you do and where you work. This helps us find the right jobs for you.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Primary Trade */}
                    <div className="space-y-2">
                        <Label htmlFor="primaryTrade" className="font-semibold text-neutral-700">Primary Trade</Label>
                        <Controller
                            name="primaryTrade"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <SelectTrigger id="primaryTrade" className="h-12 text-base w-full">
                                        <SelectValue placeholder="Select your main trade..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {trades.map((trade) => (
                                            <SelectItem key={trade.id} value={trade.id}>
                                                {trade.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.primaryTrade && <p className="text-sm text-red-600">{errors.primaryTrade.message}</p>}
                    </div>

                    {/* Base Location */}
                    <div className="space-y-2">
                        <Label htmlFor="baseLocation" className="font-semibold text-neutral-700">Your Base Location</Label>
                        <Controller
                            name="baseLocation"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="baseLocation"
                                    placeholder="e.g., San Francisco, CA"
                                    className="h-12 text-base"
                                    {...field}
                                />
                            )}
                        />
                        {errors.baseLocation && <p className="text-sm text-red-600">{errors.baseLocation.message}</p>}
                    </div>

                    {/* Travel Distance */}
                    <div className="space-y-4">
                        <Label className="font-semibold text-neutral-700">How far will you travel for jobs?</Label>
                        <Controller
                            name="travelDistance"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}  >
                                    <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your travel distances..." />
                            </SelectTrigger>
                            <SelectContent>
                                {travelDistances.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                                ))}
                            </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex space-x-3 pt-6 border-t border-gray-200">
                        <OnboardingFormButton
                            type="button"
                            onClick={() => router.back()}
                            variant="outline"
                            className="flex-1 h-12 text-base font-medium cursor-pointer"
                            text="Back"
                            isSubmitting={isSubmitting}
                            disabled={false}
                        />
                        <OnboardingFormButton
                            type="submit"
                            size="lg"
                            className={`flex-1 h-12 text-base font-medium cursor-pointer ${isValid ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-gray-300 text-gray-500'}`}
                            disabled={!isValid || isSubmitting}
                            text={isSubmitting ? "Saving..." : "Next"}
                            isSubmitting={isSubmitting}
                            onClick={() => router.push("/onboarding/contractor/step2")}
                        />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}