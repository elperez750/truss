"use client"

import { Stepper } from "@/components/ui/stepper";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const steps = [
    { title: "Basic Information", description: "Tell us a bit about yourself" },
    { title: "Preferences", description: "Tell us a bit about your preferences" },
    { title: "Summary", description: "Review your information" },
]


const stepMap = [
    "/onboarding/client/step1",
    "/onboarding/client/step2",
    "/onboarding/client/step3"
]



export default function ClientOnboardingLayout({children}: {children: ReactNode}) {
    const pathname = usePathname();
    const stepIndex = stepMap.findIndex((s) => pathname.startsWith(s))

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
            <div className="w-full mx-auto pt-8 pb-8">
                <Stepper steps={steps} currentStep={stepIndex} onStepChange={() => {}} />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
