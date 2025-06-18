import { Linkedin, Facebook, Instagram } from "lucide-react";
import downArrow from "../../../../public/Frame 1778.svg"
import star from "../../../../public/octicon_north-star-24.svg"
import cursorArrow from "../../../../public/mingcute_cursor-3-fill.svg"

const items = [
    { name: "Sales", href: "#" },
    { name: "Marketing", href: "#" },
    { name: "Automation", href: "#" },
    ]

export default function Hero() {
  return (
   <div className="">
     <div className=" text-white relative overflow-hidden sm:w-[85%] w-[95%] mx-auto">
      {/* Hero Section */}
      <section
        id="home"
        className="flex flex-col items-center relative justify-center min-h-[calc(90vh-120px)] px-6 lg:px-12 relative"
      >

        {/* Hero Text */}
        <div className="text-center sm:w-[80%] mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">Hi, I'm Babafemi Sanusi</h1>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            A Sales, Marketing And AI Automation Specialist Passionate About Driving Results And Building Meaningful
            Customer Relationships.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col pt-10 sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {items.map((item) => (
              <button
                key={item.name}
                className="bg-transparent border-2 border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 rounded-full md:px-12 py-3 text-lg font-light sm:min-w-[140px] min-w-[200px]"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute md:right-16 right-8 md:bottom-16  sm:bottom-0 bottom-[-5em] transform -translate-y-1/2">
            <img src={cursorArrow} alt="cursor arrow" className="max-sm:h-10 h-16" />
        </div>

        <div>
            <div className="absolute sm:top-[50%] top-[20%] lg:left-16 left-0 transform -translate-y-1/2">
              <img src={star} alt="star" />
            </div>
            <div className="absolute lg:right-16 right-0 sm:top-[50%] max-sm:bottom-16 transform -translate-y-1/2">
              <img src={star} alt="star" />
            </div>
        </div>
      </section>

      {/* Scroll Indicator */}
      <div className="absolute left-0 bottom-12">
        <img src={downArrow} alt="down arrow" />
      </div>

      {/* Social Media Icons */}
      <div className="fixed right-6 lg:right-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-6 z-20">
        <a
          href="#"
          className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors group"
        >
          <Linkedin className="w-6 h-6 text-gray-900 group-hover:text-white" />
        </a>
        <a
          href="#"
          className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors group"
        >
          <Facebook className="w-6 h-6 text-gray-900 group-hover:text-white" />
        </a>
        <a
          href="#"
          className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors group"
        >
          <Instagram className="w-6 h-6 text-gray-900 group-hover:text-white" />
        </a>
      </div>
    </div>
   </div>
  )
}
