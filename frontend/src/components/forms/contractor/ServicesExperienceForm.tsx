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
import { XIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form validation schema
const formSchema = z.object({
    specialties: z.array(z.string()).min(1, "Please add at least one specialty."),
    yearsExperience: z.string().min(1, "Please select your years of experience."),
    emergencyService: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

const experienceLevels = [
    { value: "0", label: "Less than 1 year" },
    { value: "1", label: "1-2 years" },
    { value: "3", label: "3-5 years" },
    { value: "6", label: "6-10 years" },
    { value: "10", label: "10+ years" },
];

export default function ServicesExperienceForm() {
    const router = useRouter();
    const { updateProfile } = useProfile();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [specialtyInput, setSpecialtyInput] = useState("");

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            specialties: [],
            yearsExperience: "",
            emergencyService: false,
        },
    });

    const specialties = watch("specialties");

    const handleAddSpecialty = () => {
        if (specialtyInput.trim() && !specialties.includes(specialtyInput.trim())) {
            setValue("specialties", [...specialties, specialtyInput.trim()], { shouldValidate: true });
            setSpecialtyInput("");
        }
    };

    const handleRemoveSpecialty = (specToRemove: string) => {
        setValue("specialties", specialties.filter(spec => spec !== specToRemove), { shouldValidate: true });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            handleAddSpecialty();
        }
    };
    
    const onSubmit = (data: FormData) => {
        setIsSubmitting(true);
        console.log("Form Data:", data);
        updateProfile({
            specialties: data.specialties,
            yearsExperience: parseInt(data.yearsExperience),
            emergencyService: data.emergencyService,
        });
        
        setTimeout(() => {
            setIsSubmitting(false);
            // router.push("/onboarding/contractor/step4");
        }, 1000);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-white">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary-800">
                    Services & Experience
                </CardTitle>
                <CardDescription className="text-neutral-500">
                    Detail your expertise to attract the best clients for your skills.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Specialties */}
                    <div className="space-y-3">
                        <Label htmlFor="specialties" className="font-semibold text-neutral-700">What are your specialties?</Label>
                        <p className="text-sm text-neutral-500">Add tags that best describe your services (e.g., "Kitchen Remodeling", "Deck Building").</p>
                        <div className="flex items-center gap-2">
                            <Input
                                id="specialties"
                                value={specialtyInput}
                                onChange={(e) => setSpecialtyInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a specialty and press Enter..."
                                className="h-12 text-base"
                            />
                            <button type="button" onClick={handleAddSpecialty} className="h-12 px-4 rounded-md bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition-colors shrink-0">Add</button>
                        </div>
                        {errors.specialties && <p className="text-sm text-red-600">{errors.specialties.message}</p>}
                        <div className="flex flex-wrap gap-2 pt-2 min-h-[34px]">
                            {specialties.map((spec) => (
                                <div key={spec} className="flex items-center gap-2 bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-sm font-medium animate-in fade-in-50">
                                    <span>{spec}</span>
                                    <button type="button" onClick={() => handleRemoveSpecialty(spec)} className="rounded-full hover:bg-primary-200 p-0.5">
                                        <XIcon className="h-4 w-4 text-primary-500 hover:text-primary-800" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Years of Experience */}
                    <div className="space-y-2">
                        <Label htmlFor="yearsExperience" className="font-semibold text-neutral-700">Years of Experience</Label>
                        <Controller
                            name="yearsExperience"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="yearsExperience" className="h-12 text-base">
                                        <SelectValue placeholder="Select your experience level..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {experienceLevels.map((level) => (
                                            <SelectItem key={level.value} value={level.value}>
                                                {level.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.yearsExperience && <p className="text-sm text-red-600">{errors.yearsExperience.message}</p>}
                    </div>

                    {/* Emergency Service */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Label htmlFor="emergencyService" className="font-semibold text-neutral-700 cursor-pointer">
                            Do you offer 24/7 emergency services?
                        </Label>
                        <Controller
                            name="emergencyService"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    id="emergencyService"
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
                            onClick={() => {router.push("/onboarding/contractor/step4")}}
                        />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}