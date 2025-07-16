import Button from "../../../components/common/ui/Button";
import rightImg from '../../../../public/Frame 1618873298.svg'
import leftImg from '../../../../public/Frame 1618873297.svg'

export default function Cultured() {
  return (
    <div className="min-h-screen my-16 relative">
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-screen">
        {/* Left Image */}
        <div className="relative">
          <img
            src={leftImg}
            alt="Modern living room with sectional sofa and pampas grass"
            className="object-cover object-left"
          />
        </div>

        {/* Center Content */}
        <div className="flex flex-col col-span-2 justify-center items-center px-8 py-16 lg:py-24 ">
          {/* Decorative diamond */}
          <div className="w-4 h-4 bg-amber-900 transform rotate-45 mb-12"></div>

          {/* Main heading */}
          <h1 className="text-center mb-8">
            <div className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
              Crafted for the <span className="italic font-serif text-amber-900">Cultured</span>
            </div>
            <div className="text-4xl lg:text-5xl font-light text-gray-900 mt-2">Home</div>
          </h1>

          {/* Description */}
          <div className="text-center text-gray-600 sm:text-2xl text-xl leading-relaxed mb-12 ">
            <p>
              At <span className="font-semibold text-gray-900">NIH Homes</span>, we believe that every detail in your
              space tells a story. Our pieces are designed to evoke emotion, elevate everyday living, and offer an
              enduring sense of beauty. With globally sourced materials and local craftsmanship, each product reflects a
              commitment to excellence.
            </p>
          </div>

          {/* CTA Button */}
          <Button className="bg-amber-900 hover:bg-amber-800 text-white px-8 py-3 rounded-full text-base font-medium">
            Explore the Collection
          </Button>
        </div>

        {/* Right Image */}
        <div className="lg:absolute right-0 bottom-0 max-lg:flex max-lg:justify-end">
          <img
            src={rightImg}
            alt="Cozy seating area with fireplace and neutral furnishings"
            className="object-cover object-right"
          />
        </div>
      </div>
    </div>
  )
}
