
import { Linkedin, FacebookIcon, InstagramIcon } from "lucide-react"
import Button from "../../../components/common/ui/Button"
import logo from "../../../../public/brandcom logo 1.svg"
import logo2 from '../../../../public/brandcom.ai.svg'

export default function Component() {
  return (
    <footer className="bg-white px-6 pt-8 border-t border-gray-100">
    <div className=" sm:w-[80%] w-[90%] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Logo */}
      <img src={logo} alt="" className="w-40"/>

      {/* Social Media Icons */}
      <div className="flex items-center gap-4">
        <a
          href="#"
          className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
          aria-label="Facebook"
        >
          <FacebookIcon className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
          aria-label="Instagram"
        >
          <InstagramIcon className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
          aria-label="Instagram"
        >
          <InstagramIcon className="w-5 h-5" />
        </a>
      </div>

      {/* Call to Action */}
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">{"Let's do it! —"}</span>
        <Button onClick={() => window.open('https://www.brandcom.store/', '_blank')}  className="bg-orange-500 hover:bg-orange-600 text-white px-6">Contact sales</Button>
      </div>
    </div>

    <div className="pt-12">
      <img src={logo2} alt="" className="mx-auto" />
    </div>
  </footer>
  )
}
