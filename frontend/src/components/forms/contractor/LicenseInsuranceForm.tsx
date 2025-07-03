'use client'

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import OnboardingFormButton from "@/components/ui/truss/OnboardingFormButton";
import { useRouter } from "next/navigation";
import { useProfile } from "@/app/context/ProfileContext";
import { AnimatePresence, motion } from "framer-motion";
// To install framer-motion: npm install framer-motion
// To install sonner (for toast notifications): npm install sonner
// To install @radix-ui/react-switch (if not already installed): npm install @radix-ui/react-switch


// Form validation schema
const formSchema = z.object({
    isLicensed: z.boolean(),
    licenseNumber: z.string().optional(),
    liabilityInsurance: z.boolean(),
}).refine(data => {
    // If licensed, license number is required
    if (data.isLicensed) {
        return data.licenseNumber && data.licenseNumber.length > 0;
    }
    return true;
}, {
    message: "License number is required if you are licensed.",
    path: ["licenseNumber"],
});

type FormData = z.infer<typeof formSchema>;

export default function LicenseInsuranceForm() {
    const router = useRouter();
    const { updateProfile, profile } = useProfile();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            isLicensed: false,
            licenseNumber: "",
            liabilityInsurance: false,
        },
    });

    const isLicensed = watch("isLicensed");

    const onSubmit = (data: FormData) => {
        setIsSubmitting(true);
        console.log("Form Data:", data);
        updateProfile({
            isLicensed: data.isLicensed,
            licenseNumber: data.licenseNumber,
            liabilityInsurance: data.liabilityInsurance,
        });
        
        setTimeout(() => {
            setIsSubmitting(false);
            // Navigate to the next step
            // router.push("/onboarding/contractor/step3");
        }, 1000);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-white">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary-800">
                    License & Insurance
                </CardTitle>
                <CardDescription className="text-neutral-500">
                    Please provide your licensing and insurance information. This helps build trust with clients.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Is Licensed */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Label htmlFor="isLicensed" className="font-semibold text-neutral-700 cursor-pointer">
                            Are you a licensed contractor?
                        </Label>
                        <Controller
                            name="isLicensed"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    id="isLicensed"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-primary-600"
                                />
                            )}
                        />
                    </div>

                    {/* License Number (Conditional) */}
                    <AnimatePresence>
                        {isLicensed && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="licenseNumber" className="font-semibold text-neutral-700">License Number</Label>
                                    <Controller
                                        name="licenseNumber"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="licenseNumber"
                                                placeholder="Enter your license number"
                                                className="h-12 text-base"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.licenseNumber && <p className="text-sm text-red-600">{errors.licenseNumber.message}</p>}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Liability Insurance */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Label htmlFor="liabilityInsurance" className="font-semibold text-neutral-700 cursor-pointer">
                            Do you have liability insurance?
                        </Label>
                        <Controller
                            name="liabilityInsurance"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    id="liabilityInsurance"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-primary-600"
                                />
                            )}
                        />
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
                            text={isSubmitting ? "Saving..." : "Next"}
                            isSubmitting={isSubmitting}
                            onClick={() => {router.push("/onboarding/contractor/step3")}}
                        />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}