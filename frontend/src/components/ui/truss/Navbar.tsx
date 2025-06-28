import Link from "next/link";
  const Navbar = () => {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Truss</h1>
            </div>
  
            <nav className="hidden md:flex space-x-8">
              <Link href="/authenticate">
                  Sign Up
                </Link>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                How it Works
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                Find Contractors
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                For Contractors
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                Login
              </a>
            </nav>
  
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    )
  }
  
  export default Navbar;