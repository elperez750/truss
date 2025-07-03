"use client"

import { Stepper } from "@/components/ui/stepper";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const steps = [
    { title: "Trade & Service Area", description: "Tell us a bit about yourself" },
    { title: "License & Insurance", description: "Tell us a bit about your preferences" },
    { title: "Services & Experience", description: "Review your information" },
    { title: "Business Details", description: "Review your information" },
    { title: "Summary", description: "Final review" },
]


const stepMap = [
    "/onboarding/contractor/step1",
    "/onboarding/contractor/step2",
    "/onboarding/contractor/step3",
    "/onboarding/contractor/step4",
    "/onboarding/contractor/step5",
]



export default function ContractorOnboardingLayout({children}: {children: ReactNode}) {
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
