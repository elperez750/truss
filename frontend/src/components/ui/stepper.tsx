"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepProps {
  title: string
  description?: string
  isCompleted?: boolean
  isActive?: boolean
  stepNumber: number
}

const Step: React.FC<StepProps> = ({ title, description, isCompleted, isActive, stepNumber }) => {
  return (
    <div className="flex flex-col items-center text-center relative">
      {/* Step Circle */}
      <div className="relative z-10 mb-4">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
            isCompleted
              ? "bg-success-600 text-white border-2 border-success-600"
              : isActive
                ? "bg-primary-600 text-white border-2 border-primary-600 ring-4 ring-primary-100"
                : "bg-neutral-100 text-neutral-500 border-2 border-neutral-300"
          )}
        >
          {isCompleted ? (
            <Check className="w-6 h-6" />
          ) : (
            <span className="text-lg font-bold">{stepNumber}</span>
          )}
        </div>
      </div>
      
      {/* Step Content */}
      <div className="space-y-1">
        <h3 className={cn(
          "text-base font-semibold transition-colors duration-200",
          isActive || isCompleted ? "text-primary-800" : "text-neutral-600"
        )}>
          {title}
        </h3>
        {description && (
          <p className={cn(
            "text-sm transition-colors duration-200",
            isActive || isCompleted ? "text-neutral-700" : "text-neutral-500"
          )}>
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

interface StepperProps {
  steps: Array<{ title: string; description?: string }>
  currentStep: number
  onStepChange: (step: number) => void
}

export function Stepper({ steps, currentStep, onStepChange }: StepperProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 overflow-x-auto">
      {/* Progress Bar Background */}
      <div className="relative mb-12 min-w-[800px]">
        {/* Background Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-neutral-200 rounded-full" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-primary-600 to-success-600 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${((currentStep) / (steps.length - 1)) * 100}%` 
          }}
        />
        
        {/* Steps */}
        <div className="relative flex justify-between items-start">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 min-w-[160px] px-2">
              <Step
                key={step.title}
                title={step.title}
                description={step.description}
                isCompleted={index < currentStep}
                isActive={index === currentStep}
                stepNumber={index + 1}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full px-6 py-2 shadow-md border border-neutral-200">
          <span className="text-sm font-medium text-neutral-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  )
}

