import { Check } from "lucide-react";

const WhyUs = () => {
return (
    <section className="py-20 px-4 bg-background ">
    <div className="container mx-auto p-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-800">
              Why Choose TradeWise?
            </h2>
            <p className="text-lg text-neutral-700">
              We make it easy to find and hire the right professional for your project with confidence.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">AI-Powered Matching</h3>
                <p className="text-neutral-600">
                  Our advanced algorithm matches you with partners based on skills, 
                  availability, and project needs.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Vetted Professionals</h3>
                <p className="text-neutral-600">
                  All partners are thoroughly screened for qualifications, licensing, and 
                  customer reviews.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Secure Messaging</h3>
                <p className="text-neutral-600">
                  Built-in messaging system to communicate safely with contractors 
                  throughout your project.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <img 
            src="/images/contractor-handshake.jpeg" 
            alt="Contractor and client shaking hands" 
            className="rounded-lg shadow-lg max-w-md w-full"
          />
        </div>
      </div>
    </div>
  </section>
)
}

export default WhyUs;