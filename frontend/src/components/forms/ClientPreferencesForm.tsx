"use client";

import { useAuth } from "@/app/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ClientProfile } from "@/types/profileTypes";

// Validation schema
const clientPreferencesFormSchema = z.object({
  preferredContactMethod: z.enum(["email", "phone", "text"], {
    required_error: "Preferred contact method is required",
  }),
  location: z.string().min(1, "Location is required"),
  primaryGoal: z.string().min(1, "Primary goal is required"),
});

type ClientPreferencesFormData = z.infer<typeof clientPreferencesFormSchema>;

export default function ClientPreferencesForm() {
  const { profile, updateProfile, role } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize form with profile values if present
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<ClientPreferencesFormData>({
    resolver: zodResolver(clientPreferencesFormSchema),
    mode: "onChange",
    defaultValues: {
      preferredContactMethod:
        (profile as ClientProfile)?.preferredContactMethod as "email" | "phone" | "text" || "email",
      location: (profile as ClientProfile)?.clientLocation || "",
      primaryGoal: (profile as ClientProfile)?.primaryGoal || "",
    },
  });

  // For Select, keep in sync with RHF
  const preferredContactMethod = watch("preferredContactMethod");

  const onSubmit = (data: ClientPreferencesFormData) => {
    setIsSubmitting(true);
    try {
      updateProfile({
        ...profile,
        role: role as "client" | "contractor",
        preferredContactMethod: data.preferredContactMethod,
        clientLocation: data.location,
        primaryGoal: data.primaryGoal,
      });
      router.push("/onboarding/client/step3");
    } catch (error) {
      console.error("Error submitting client preferences:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="w-xl mx-auto pb-8 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md mx-auto shadow-sm border border-gray-200">
          <CardHeader className="space-y-3 pb-8">
            <CardTitle className="text-3xl font-bold text-center text-primary-800">
              Your Preferences
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Tell us a bit about your preferences
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Preferred Contact Method Field */}
              <div className="space-y-2">
                <Label htmlFor="preferredContactMethod" className="text-sm font-medium text-gray-700">
                  Preferred Contact Method
                </Label>
                <Select
                  value={preferredContactMethod}
                  onValueChange={value =>
                    setValue("preferredContactMethod", value as "email" | "phone" | "text", {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger
                    className={`h-12 w-full text-base border-gray-300 focus:border-primary-600 focus:ring-primary-600 ${
                      errors.preferredContactMethod
                        ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select a contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
                {errors.preferredContactMethod && (
                  <p className="text-sm text-error-600">{errors.preferredContactMethod.message}</p>
                )}
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter your location"
                  className={`h-12 text-base border-gray-300 focus:border-primary-600 focus:ring-primary-600 ${
                    errors.location
                      ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                      : ""
                  }`}
                  {...register("location")}
                />
                {errors.location && (
                  <p className="text-sm text-error-600">{errors.location.message}</p>
                )}
              </div>

              {/* Primary Goal Field */}
              <div className="space-y-2">
                <Label htmlFor="primaryGoal" className="text-sm font-medium text-gray-700">
                  Primary Goal
                </Label>
                <Textarea
                  id="primaryGoal"
                  placeholder="What type of job are you looking to get done"
                  className={`h-24 text-base border-gray-300 focus:border-primary-600 focus:ring-primary-600 ${
                    errors.primaryGoal
                      ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                      : ""
                  }`}
                  {...register("primaryGoal")}
                />
                {errors.primaryGoal && (
                  <p className="text-sm text-error-600">{errors.primaryGoal.message}</p>
                )}
                {JSON.stringify(profile)}
                {JSON.stringify(role)}
              </div>

              {/* Navigation Buttons */}    
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={() => router.push("/onboarding/client/step1")}
                  variant="outline"
                  size="lg"
                  className="flex-1 h-12 text-base font-medium border-gray-300 hover:bg-gray-50 cursor-pointer"
                  disabled={isSubmitting}
                >
                  Previous
                  
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className={`flex-1 h-12 text-base font-medium cursor-pointer ${
                    isValid
                      ? "bg-primary-600 hover:bg-primary-700 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
