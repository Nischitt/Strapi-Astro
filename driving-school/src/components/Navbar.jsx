export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-[9999]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <a href="/hero"><h1 className="text-3xl font-bold text-yellow-500">
          udrive
        </h1></a>

        {/* Menu */}
        <div className="flex gap-8 font-medium">

          {/* HOME */}
          <div className="relative group">
            <button className="py-2">HOME</button>

            <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md w-48 z-[9999]">
              <a href="/hero" className="block px-4 py-3 hover:bg-gray-100">
                Home Page
              </a>
            </div>
          </div>

          {/* ABOUT */}
          <div className="relative group">
            <button className="py-2">ABOUT</button>

            <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md w-56 z-[9999]">
              <a href="/about" className="block px-4 py-3 hover:bg-gray-100">
                About Us
              </a>

              <a href="/team" className="block px-4 py-3 hover:bg-gray-100">
                Our Team
              </a>

              <a href="/mission" className="block px-4 py-3 hover:bg-gray-100">
                Mission & Vision
              </a>
            </div>
          </div>

          {/* COURSES */}
          <div className="relative group">
            <button className="py-2">COURSES</button>

            <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md w-56 z-[9999]">
              <a href="/Modern" className="block px-4 py-3 hover:bg-gray-100">
                Modern Course
              </a>

              {/*<a href="/courses" className="block px-4 py-3 hover:bg-gray-100">
                Classic Course
              </a>*/}

              <a href="/single" className="block px-4 py-3 hover:bg-gray-100">
                Single Course
              </a>
            </div>
          </div>

          {/* SERVICES 
          <div className="relative group">
            <button className="py-2">SERVICES</button>

            <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md w-56 z-[9999]">
              <a href="/Modrn" className="block px-4 py-3 hover:bg-gray-100">
                Modern
              </a>

              <a href="/road-test" className="block px-4 py-3 hover:bg-gray-100">
                Classic
              </a>

              <a href="/private-lessons" className="block px-4 py-3 hover:bg-gray-100">
                Driving Course
              </a>
              <a href="/private-lessons" className="block px-4 py-3 hover:bg-gray-100">
                Driving License
                </a>
                 <a href="/private-lessons" className="block px-4 py-3 hover:bg-gray-100">
                Insurance
                </a>
            </div>
          </div>*/}

          {/* BLOG */}
          <div className="relative group">
            <button className="py-2">BLOG</button>

            <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md w-56 z-[9999]">
              <a href="/Blog" className="block px-4 py-3 hover:bg-gray-100">
                View Blog
              </a>

              <a href="/Tips" className="block px-4 py-3 hover:bg-gray-100">
                Driving Tips
              </a>

              <a href="/news" className="block px-4 py-3 hover:bg-gray-100">
                News & Updates
              </a>
            </div>
          </div>

          {/* CONTACT */}
          <a href="/contact" className="py-2">
            CONTACT
          </a>

        </div>

        {/* Button */}
        <button className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600" >
            <a href="/Contact">CONSULTATION</a>
          
        </button>

      </div>
    </nav>
  );
}