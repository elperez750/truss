'use client'

import { useState } from "react";
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
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);


    // This code sets up React Hook Form for managing form state and validation
    const {
        control,        // Used to control form inputs (especially for custom components like Select)
        handleSubmit,   // Function that handles form submission and validation
        formState: { errors, isValid }, // Destructured form state for error handling and validation status
    } = useForm<FormData>({
        resolver: zodResolver(formSchema), // Uses Zod schema for form validation
        mode: "onChange",                  // Validates form fields as user types (real-time validation)
        defaultValues: {                   // Initial values for form fields
            primaryTrade: "",
            baseLocation: "",
            travelDistance: "",
        },  

    });

    const onSubmit = (data: FormData) => {
        setIsSubmitting(true);
        console.log("Form Data:", data);
        updateProfile({
            primaryTrade: data.primaryTrade,
            baseLocation: data.baseLocation,
            serviceArea: data.travelDistance,
        });
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            // Navigate to the next step
            // router.push("/onboarding/contractor/step3");
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="primaryTrade" className="h-12 text-base">
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
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