import Button from "../../../components/common/ui/Button";
import logo from '/public/brandcom logo 1.svg'
import { useState } from 'react';

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        {
            name: 'Home',
            href: '#'
        },
        {
            name: 'About',
            href: '#'
        },
        {
            name: 'Contact',
            href: '#'
        }
    ]

    return (
      <header className="flex items-center justify-between px-6 border-b py-4 sm:w-[80%] w-[95%] mx-auto">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="max-sm:w-40" />
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
              <a href={item.href} className="text-orange-500 font-medium">
                  {item.name}
              </a>
          ))}
        </nav>

        <button 
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg 
            className="w-6 h-6" 
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
          className={`md:hidden fixed top-0 right-0 bottom-0 w-[95%] z-50 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-8 border-b shadow-lg bg-white h-full">
            <div className="absolute top-8 right-8">
                <svg
                    className="w-6 h-6 cursor-pointer" 
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
            <nav className="flex flex-col gap-4 pt-12 justify-center">
              {navItems.map((item) => (
                <a 
                  href={item.href} 
                  className="text-orange-500 font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact sales
              </Button>
            </nav>
          </div>
        </div>

        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-6 md:block hidden">Contact sales</Button>
      </header>
    )
}