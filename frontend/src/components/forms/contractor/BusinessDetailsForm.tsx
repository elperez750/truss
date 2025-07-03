'use client'

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import OnboardingFormButton from "@/components/ui/truss/OnboardingFormButton";
import { useRouter } from "next/navigation";
import { useProfile } from "@/app/context/ProfileContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form validation schema
const formSchema = z.object({
    businessName: z.string().optional(),
    hourlyRate: z.string().optional(),
    serviceFee: z.string().optional(),
    availability: z.enum(['full-time', 'part-time', 'project-based'], {
        required_error: "Please select your availability."
    }),
});

type FormData = z.infer<typeof formSchema>;

const availabilityOptions = [
    { value: 'project-based', label: 'By Project' },
    { value: 'full-time', label: 'Full-Time' },
    { value: 'part-time', label: 'Part-Time' },
];

export default function BusinessDetailsForm() {
    const router = useRouter();
    const { updateProfile } = useProfile();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            businessName: "",
            hourlyRate: "",
            serviceFee: "",
            availability: "project-based",
        },
    });

    const onSubmit = (data: FormData) => {
        setIsSubmitting(true);
        const numericData = {
            ...data,
            hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : undefined,
            serviceFee: data.serviceFee ? parseFloat(data.serviceFee) : undefined,
        };
        console.log("Formatted Data:", numericData);
        updateProfile(numericData);
        
        setTimeout(() => {
            setIsSubmitting(false);
            // Navigate to the final summary page
            // router.push("/onboarding/contractor/summary");
        }, 1000);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-white">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary-800">
                    Business Details & Rates
                </CardTitle>
                <CardDescription className="text-neutral-500">
                    Set your rates and availability to get matched with the right projects.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Business Name */}
                    <div className="space-y-2">
                        <Label htmlFor="businessName" className="font-semibold text-neutral-700">Business Name (Optional)</Label>
                        <Controller
                            name="businessName"
                            control={control}
                            render={({ field }) => <Input id="businessName" placeholder="e.g., John Doe Carpentry" className="h-12 text-base" {...field} />}
                        />
                    </div>
                    
                    {/* Rates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="hourlyRate" className="font-semibold text-neutral-700">Hourly Rate (Optional)</Label>
                             <Controller
                                name="hourlyRate"
                                control={control}
                                render={({ field }) => (
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">$</span>
                                        <Input id="hourlyRate" type="number" placeholder="50" className="h-12 text-base pl-7" {...field} />
                                    </div>
                                )}
                            />
                            {errors.hourlyRate && <p className="text-sm text-red-600">{errors.hourlyRate.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="serviceFee" className="font-semibold text-neutral-700">Service Fee (Optional)</Label>
                            <Controller
                                name="serviceFee"
                                control={control}
                                render={({ field }) => (
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">$</span>
                                        <Input id="serviceFee" type="number" placeholder="100" className="h-12 text-base pl-7" {...field} />
                                    </div>
                                )}
                            />
                             {errors.serviceFee && <p className="text-sm text-red-600">{errors.serviceFee.message}</p>}
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="space-y-2">
                        <Label htmlFor="availability" className="font-semibold text-neutral-700">Your Availability</Label>
                        <Controller
                            name="availability"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="availability" className="h-12 text-base">
                                        <SelectValue placeholder="Select your availability..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availabilityOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.availability && <p className="text-sm text-red-600">{errors.availability.message}</p>}
                    </div>
                    
                    {/* Navigation Buttons */}
                    <div className="flex space-x-3 pt-6 border-t border-gray-200">
                        <OnboardingFormButton
                            type="button"
                            onClick={() => router.back()}
                            variant="outline"
                            className="flex-1 h-12 text-base font-medium"
                            text="Back"
                            isSubmitting={isSubmitting}
                            disabled={isSubmitting}
                        />
                        <OnboardingFormButton
                            type="submit"
                            size="lg"
                            className={`flex-1 h-12 text-base font-medium ${isValid ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-gray-300 text-gray-500'}`}
                            disabled={!isValid || isSubmitting}
                            text={isSubmitting ? "Saving..." : "Review Profile"}
                            isSubmitting={isSubmitting}
                            onClick={() => {}}
                        />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 