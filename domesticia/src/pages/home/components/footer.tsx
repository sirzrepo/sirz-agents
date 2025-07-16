
import logo from '../../../../public/image 18.svg'
export default function Footer() {
  return (
    <footer className="bg-[#2D2D2D] text-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-8">
      <div className="flex flex-col items-center space-y-2">
        {/* Placeholder for the golden logo */}
        <img
          src={logo}
          alt="Company Logo"
          width={64}
          height={64}
          className="" 
        />
        <span className="text-xs text-[#CBA461]">NIH HOMES</span>
      </div>

      <nav className="flex items-center sm:flex-row gap-6 sm:gap-10 text-lg">
        <a href="#" className="underline underline-offset-4 underline-[#CBA461]">
          Home
        </a>
        <a href="#" className="underline underline-offset-4 underline-[#CBA461]">
          Our Shop
        </a>
        <a href="#" className="underline underline-offset-4 underline-[#CBA461]">
          About Us
        </a>
      </nav>

      <p className="text-sm">{"Copyright @ 2025"}</p>
    </footer>
  )
}
