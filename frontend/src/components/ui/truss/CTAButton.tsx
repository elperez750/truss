import { Button as ShadcnButton } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface CTAButtonProps {
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    className?: string
}


export default function CTAButton({ variant = 'primary', size = 'md', children, onClick, disabled, className }: CTAButtonProps) {
    const baseStyles = {
        'primary': "bg-primary-700 hover:bg-primary-800 text-white",
        'secondary': "bg-secondary-500 hover:bg-secondary-600 text-white",
        'outline': "border border-primary-800 hover:bg-primary-800 hover:text-white bg-white text-primary-800"
    }

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-8 text-lg"
    }



    return (

        <ShadcnButton
            className={cn(
                baseStyles[variant],
                sizes[size],
                "font-semibold rounded-md transition-colors cursor-pointer",
                className
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </ShadcnButton>


    )
}