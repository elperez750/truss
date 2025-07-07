'use client';

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfile } from "@/app/context/ProfileContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import OnboardingFormButton from "@/components/ui/truss/OnboardingFormButton";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ContractorProfile } from "@/types/profileTypes";

const submitFormSchema = z.object({
    // Basic Information
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),

    // Step 1
    primaryTrade: z.string(),
    baseLocation: z.string(),
    serviceArea: z.string(),

    // Step 2
    isLicensed: z.boolean(),
    licenseNumber: z.string().optional(),
    liabilityInsurance: z.boolean(),

    // Step 3
    specialties: z.array(z.string()),
    yearsExperience: z.string(),
    emergencyService: z.boolean().optional(),

    // Step 4
    businessName: z.string().optional(),
    hourlyRate: z.number().optional(),
    serviceFee: z.number().optional(),
    availability: z.enum(['full-time', 'part-time', 'project-based']).optional(),
});

export type ContractorSubmitFormData = z.infer<typeof submitFormSchema>;

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between items-center py-2">
        <p className="font-medium text-gray-600">{label}</p>
        <p className="text-gray-800 text-right">{value || 'N/A'}</p>
    </div>
);

export default function ContractorDetailsSubmitForm() {
    const { profile } = useProfile();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Since this is for contractors, we can cast the profile type
    const contractorProfile = profile as ContractorProfile;

    const { handleSubmit } = useForm<ContractorSubmitFormData>({
        resolver: zodResolver(submitFormSchema),
        defaultValues: {
            ...contractorProfile
        }
    });

    const onSubmit = async (data: ContractorSubmitFormData) => {
        setIsSubmitting(true);


        console.log("Form submitted with data:", data);
        // Here you would typically send the data to your backend
        // For now, we'll just log it and navigate to a success page.

        const { submitContractorDetails } = await import('@/app/actions/contractor/submitProfile');
        const message = await submitContractorDetails(data);  
        console.log("message", message);
        if (message.success) {
            router.push('/onboarding/contractor/step6');
        } else {
            console.error("Error submitting profile:", message.message);
        }
    };
    
    console.log("profile", profile);
    console.log("contractorProfile", contractorProfile);
    if (!profile) {
        return <div>Loading profile or not a contractor...</div>;
    }

    return (
        <div className="min-h-screen">
            <div className="w-xl mx-auto pb-8 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-2xl mx-auto shadow-sm border border-gray-200">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold text-primary-800">Review Your Details</CardTitle>
                        <CardDescription className="text-gray-600">Please review your information carefully before submitting.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 p-8">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-xl font-semibold text-primary-700 mb-4">Basic Information</h3>
                                <div className="space-y-2">
                                    <DetailItem label="First Name" value={contractorProfile.firstName} />
                                    <DetailItem label="Last Name" value={contractorProfile.lastName} />
                                    <DetailItem label="Email" value={contractorProfile.email} />
                                    <DetailItem label="Phone Number" value={contractorProfile.phoneNumber} />
                                </div>
                            </div>
                            <Separator className="my-6" />

                             {/* Business Details & Trade */}
                             <div>
                                <h3 className="text-xl font-semibold text-primary-700 mb-4">Business & Trade</h3>
                                <div className="space-y-2">
                                    <DetailItem label="Business Name" value={contractorProfile.businessName} />
                                    <DetailItem label="Primary Trade" value={contractorProfile.primaryTrade} />
                                    <DetailItem label="Base Location" value={contractorProfile.baseLocation} />
                                    <DetailItem label="Service Area" value={contractorProfile.serviceArea} />
                                </div>
                            </div>
                            <Separator className="my-6" />

                            {/* Services and Experience */}
                            <div>
                                <h3 className="text-xl font-semibold text-primary-700 mb-4">Services & Experience</h3>
                                 <div className="space-y-2">
                                    <DetailItem label="Specialties" value={contractorProfile.specialties?.join(', ')} />
                                    <DetailItem label="Years of Experience" value={contractorProfile.yearsExperience} />
                                     <DetailItem label="Emergency Service" value={contractorProfile.emergencyService ? 'Yes' : 'No'} />
                                </div>
                            </div>
                            <Separator className="my-6" />

                            {/* License and Insurance */}
                            <div>
                                <h3 className="text-xl font-semibold text-primary-700 mb-4">License & Insurance</h3>
                                 <div className="space-y-2">
                                    <DetailItem label="Licensed" value={contractorProfile.isLicensed ? 'Yes' : 'No'} />
                                    {contractorProfile.isLicensed && <DetailItem label="License Number" value={contractorProfile.licenseNumber} />}
                                    <DetailItem label="Liability Insurance" value={contractorProfile.liabilityInsurance ? 'Yes' : 'No'} />
                                </div>
                            </div>

                            {/* Pricing and Availability */}
                            <Separator className="my-6" />
                            <div>
                                <h3 className="text-xl font-semibold text-primary-700 mb-4">Pricing & Availability</h3>
                                 <div className="space-y-2">
                                    <DetailItem label="Hourly Rate" value={contractorProfile.hourlyRate ? `$${contractorProfile.hourlyRate}` : 'N/A'} />
                                    <DetailItem label="Service Fee" value={contractorProfile.serviceFee ? `$${contractorProfile.serviceFee}` : 'N/A'} />
                                    <DetailItem label="Availability" value={contractorProfile.availability} />
                                </div>
                            </div>

                             <div className="flex space-x-3 pt-8">
                                <OnboardingFormButton
                                    type="button"
                                    text="Back"
                                    onClick={() => router.back()}
                                    isSubmitting={isSubmitting}
                                    disabled={isSubmitting}
                                    className="flex-1 h-12 text-base font-medium border-gray-300 hover:bg-gray-50 cursor-pointer"
                                />
                                <OnboardingFormButton
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                    text={isSubmitting ? "Submitting..." : "Submit Profile"}
                                    isSubmitting={isSubmitting}
                                    onClick={handleSubmit(onSubmit)}
                                    className="flex-1 h-12 text-base font-medium bg-primary-600 hover:bg-primary-700 text-white cursor-pointer"
                                />
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}





