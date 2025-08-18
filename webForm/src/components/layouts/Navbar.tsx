'use client';

import Link from 'next/link';
import { 
  Moon, 
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="dark:bg-gray-900/90 bg-white dark:border-b dark:border-gray-700/50 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="mx-auto lg:max-w-[80%] px-4">
        <div className="flex justify-between items-center sm:h-24 h-16">
          <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                  <img
                    src="/images/logo.png"
                    alt="Rekobo Logo"
                    className="h-10 sm:h-14"
                  />
              </Link>
          </div>
         

          <div className="flex items-center  gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleTheme();
              }}
              className="flex w-full items-center justify-between text-sm dark:border-gray-700"
            >
              <div className="flex items-center">
                {theme === 'dark' ? <Sun size={18} className="mr-2 text-amber-400" /> : <Moon size={18} className="mr-2 text-primary" />}
              </div>
            </button>
            <Button className="">
              <Link href="/support" className="text-white hover:text-white/80">
                Get started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 