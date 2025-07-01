import { Button } from "@/components/ui/Button";



type OnboardingFormButtonProps = {
    onClick: () => void;
    isSubmitting: boolean;
    text: string;
    className: string;
    type: "button" | "submit";
    disabled: boolean;
    size?: "lg" | "sm" | "icon";
    variant?: "outline" | "default";
}


export default function OnboardingFormButton({ onClick, isSubmitting, text, className, type,  disabled, variant="outline", size="lg" }: OnboardingFormButtonProps) {


    return (
        <Button
        type={type}
        onClick={onClick}
        className={className}
        disabled={isSubmitting || disabled}
        variant={variant}
        size={size}
      >
        {text}
        
      </Button>
    )
}
