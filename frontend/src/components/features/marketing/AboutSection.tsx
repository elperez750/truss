const AboutSection = () => {
    const steps = [
      {
        number: 1,
        title: "Post Your Job",
        description: "Describe your painting project and requirements",
      },
      {
        number: 2,
        title: "Get Matched",
        description: "Our AI finds qualified contractors in your area",
      },
      {
        number: 3,
        title: "Hire & Connect",
        description: "Review profiles, message contractors, and start your project",
      },
    ]
  
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">How Truss Works</h2>
            <p className="text-lg text-gray-600">Get matched with the right contractor in three simple steps</p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center group">
                <div className="w-16 h-16 bg-primary-800 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:bg-blue-700 transition-colors">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-primary-800">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  export default AboutSection
  