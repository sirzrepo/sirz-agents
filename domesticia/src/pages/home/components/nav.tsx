import logo from '/public/image 18.svg'
import { useState } from 'react';

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        {
            name: 'Home',
            href: '#'
        },
        {
            name: 'About Us',
            href: '#'
        },
        {
            name: 'Contact Us',
            href: '#'
        }
    ]

    return (
      <nav className="bg-[#2D2D2D] fixed top-5 left-0 right-0 z-50 rounded-full sm:w-[80%] w-[95%] mx-auto">
        <header className="flex items-center justify-between relative z-50 px-6 py-2 sm:w-[90%] w-[95%] mx-auto">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="sm:w-[70px] w-[50px]" />
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
              <a href={item.href} className="text-white font-medium">
                  {item.name}
              </a>
          ))}
        </nav>

        <button 
          className="md:hidden basis z-50 p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg 
            className="w-6 text-white h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div 
          className={`md:hidden fixed top-0 right-0 bottom-0 w-full z-50 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-8 border-b shadow-lg bg-[#2D2D2D] h-full">
            <div className="flex absolute top-6 left-4 items-center gap-2">
              <img src={logo} alt="Logo" className="w-[50px]" />
            </div>

            <div className="absolute top-8 right-8">
                <svg
                    className="w-6 h-6 text-white cursor-pointer" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </div>

            <nav className="flex flex-col gap-4 pt-20 justify-center">
              {navItems.map((item) => (
                <a 
                  href={item.href} 
                  className="text-white font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <button 
              onClick={() => {window.open('https://www.brandcom.store/', '_blank'); setIsMenuOpen(false)}}
                className="bg-white hover:bg-white text-black px-6 py-3 rounded-full mt-4"
                // onClick={() => setIsMenuOpen(false)}
              >
                Contact sales
              </button>
            </nav>
          </div>
        </div>

        <button 
          onClick={() => {window.open('https://www.brandcom.store/', '_blank'); setIsMenuOpen(false)}} 
          className="bg-white hover:bg-white text-black px-6 py-3 rounded-full md:block hidden"
        >
          Contact sales
        </button>
        </header>
      </nav>
    )
}