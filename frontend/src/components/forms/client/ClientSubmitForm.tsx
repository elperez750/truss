import { useAuth } from "@/app/context/AuthContext";
import { ClientProfile } from "@/types/profileTypes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OnboardingFormButton from "../../ui/truss/OnboardingFormButton";

export default function ClientSubmitForm() {
    const { profile, role } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const clientProfile = role === 'client' ? (profile as ClientProfile) : null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Here you would typically submit to your backend
            console.log('Submitting profile:', profile);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Redirect to dashboard or next step
            router.push('/dashboard'); // or wherever you want to redirect after submission
        } catch (error) {
            console.error('Error submitting profile:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!profile || !clientProfile) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <p className="text-gray-500">Loading profile information...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg border-0 rounded-xl bg-white overflow-hidden">
                <CardHeader className="p-6 sm:p-8 bg-white">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-primary-900">
                        Confirm Your Details
                    </CardTitle>
                    <CardDescription className="text-neutral-500 mt-1">
                        Please review your information carefully. You can go back to make changes.
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 sm:p-8 pt-0">
                    <div className="space-y-8">
                        {/* Basic Information Section */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-600 cursor-pointer">
                                Personal Information
                            </h3>
                            <div className="rounded-lg border border-gray-200 divide-y divide-gray-200">
                                <div className="flex justify-between items-center p-4">
                                    <p className="text-sm text-neutral-600">Full Name</p>
                                    <p className="text-sm font-semibold text-neutral-800">{clientProfile.firstName} {clientProfile.lastName}</p>
                                </div>
                                <div className="flex justify-between items-center p-4">
                                    <p className="text-sm text-neutral-600">Email Address</p>
                                    <p className="text-sm font-semibold text-neutral-800">{clientProfile.email}</p>
                                </div>
                                <div className="flex justify-between items-center p-4">
                                    <p className="text-sm text-neutral-600">Phone Number</p>
                                    <p className="text-sm font-semibold text-neutral-800">{clientProfile.phoneNumber || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Preferences Section */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-600">
                                Project Preferences
                            </h3>
                            <div className="rounded-lg border border-gray-200 divide-y divide-gray-200">
                                <div className="flex justify-between items-center p-4">
                                    <p className="text-sm text-neutral-600">Preferred Contact</p>
                                    <p className="text-sm font-semibold text-neutral-800 capitalize">{clientProfile.preferredContactMethod}</p>
                                </div>
                                <div className="flex justify-between items-center p-4">
                                    <p className="text-sm text-neutral-600">Your Location</p>
                                    <p className="text-sm font-semibold text-neutral-800">{clientProfile.clientLocation || 'Not provided'}</p>
                                </div>
                                <div className="flex justify-between items-center p-4">
                                    <p className="text-sm text-neutral-600">Primary Goal</p>
                                    <p className="text-sm font-semibold text-neutral-800">{clientProfile.primaryGoal || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                        <OnboardingFormButton
                            type="button"
                            onClick={() => router.push("/onboarding/client/step2")}
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto cursor-pointer"
                            disabled={isSubmitting}
                            text="Go Back"
                            isSubmitting={false}
                        />
                        
                        <OnboardingFormButton
                            type="button"
                            onClick={handleSubmit}
                            size="lg"
                            className="w-full sm:w-auto flex-1 bg-primary-600 hover:bg-primary-700 text-white cursor-pointer"
                            disabled={isSubmitting}
                            text={isSubmitting ? "Submitting..." : "Confirm & Complete"}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}