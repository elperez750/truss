import CTAButton from "@/components/ui/truss/CTAButton";

const CTASection = () => {
    return (
    <div className="bg-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                <p className="text-lg text-gray-200">Join our community of trusted professionals and start finding jobs today.</p>
            </div>
            <div className="flex justify-center gap-4">
                <CTAButton variant="secondary" size="lg">Post a Job</CTAButton>
                <CTAButton variant="outline" size="lg" className="border-white text-white bg-primary-800">Join as Contractor</CTAButton>
            </div>
        </div>
    </div>
    )

}



export default CTASection;