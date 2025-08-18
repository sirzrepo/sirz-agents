import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-gray-900/90 backdrop-blur-md border-t border-gray-700/50 py-12 px-4">
        <div className="sm:w-[80%] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
                <img
                  src="/images/logo.png"
                  alt="Rekobo Logo"
                  className="h-8 sm:h-10"
                />
            </Link>
              <p className="text-gray-400 mb-6 max-w-md">
                Nigeria&apos;s most trusted marketplace connecting buyers and sellers across all 36 states. Safe, secure,
                and reliable since 2020.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Marketplace</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/listings" className="hover:text-white">
                    Browse Items
                  </Link>
                </li>
                <li>
                  <Link href="/sell" className="hover:text-white">
                    Sell Item
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-white">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/premium" className="hover:text-white">
                    Premium Listings
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-white">
                    Safety Tips
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/dispute" className="hover:text-white">
                    Report Issue
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 mb-4 md:mb-0">
                <p>&copy; 2025 Rekobo. All rights reserved.</p>
              </div>
              <div className="flex space-x-6 text-gray-400">
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-white">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
}