import { Separator } from "@/components/ui/separator";


const Footer = () => {
    return (
        <footer className="py-12 px-4 bg-background border-t border-neutral-200">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-xl font-bold text-primary-800">Truss</span>
              </div>
              <p className="text-neutral-700 text-sm max-w-xs">
                Connecting homeowners with trusted professionals through AI-powered matching.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors">
                  <span className="text-xs font-bold text-neutral-700">f</span>
                </a>
                <a href="#" className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors">
                  <span className="text-xs font-bold text-neutral-700">in</span>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-primary-800">For Homeowners</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li><a href="#" className="hover:text-secondary-500 transition-colors">Find a Job</a></li>
                <li><a href="#" className="hover:text-secondary-500 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-secondary-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-secondary-500 transition-colors">Safety</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-primary-800">For Contractors</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li><a href="#" className="hover:text-secondary-500 transition-colors">Join as Partner</a></li>
                <li><a href="#" className="hover:text-secondary-500 transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-secondary-500 transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-secondary-500 transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-primary-800">Company</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li><a href="#" className="hover:text-secondary-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-secondary-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-secondary-500 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-secondary-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-secondary-500 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="text-center text-sm text-neutral-500">
            <p>© 2024 TradeWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}


export default Footer;