
import { MapPin, Phone, Mail } from "lucide-react"

export default function Component() {
  return (
    <footer className="bg-[radial-gradient(circle,_#1b203c_0%,_#141414_90%)] text-white py-12 px-6">
      <div className="sm:w-[85%] w-[95%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* My Profile Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-s border-cyan-400 ps-3">My Profile</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
            Babalemi Samuel is a Sales and Marketing Specialist helping businesses grow with smart strategy and measurable results.
            </p>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-s border-cyan-400 ps-3">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>7 Barmouth Road marine parade LL42 1NA</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>07407245685</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@sirz.co.uk</span>
              </div>
            </div>
          </div>

          {/* Stay In The Loop Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-s border-cyan-400 ps-3">Stay In The Loop.</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Subscribe for tips and updates on sales and marketing that drive real growth.
            </p>
            <div className="flex bg-red-500 border h-16">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="bg-transparent text-black  bg-white placeholder:text-gray-500 border-0 ps-2 flex-1"
              />
              <button className="bg-[#141414] hover:bg-gray-600 text-white px-6">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400 text-sm">© 2025 Babalemi Samuel</p>
          <p className="text-gray-400 text-sm">All Rights Reserved | Built With Purpose</p>
        </div>
      </div>
    </footer>
  )
}
