
import Button from "../../../components/common/ui/Button"
import image from '/public/heroBg.svg'

export default function Hero() {
  return (
    <div className="min-h-screen sm:w-[80%] mx-auto">

      {/* Hero Section */}
      <section className="px-6 py-16 mx-auto text-center">

         {/* Background decorative elements */}
        <div className="absolute z-10 inset-0 overflow-hidden">
          <div className="absolute z-10 -top-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full"></div>
          <div className="absolute z-10 -bottom-40 -right-40 w-80 h-80 bg-pink-500/20 rounded-full"></div>
          <div className="absolute z-10 top-1/2 left-1/4 w-60 h-60 bg-pink-400/10 rounded-full"></div>
          <div className="absolute z-10 top-1/4 right-1/3 w-40 h-40 bg-pink-400/10 rounded-full"></div>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
          THINK IT. CLICK IT. BUILD IT.
        </h1>

        <div className="max-w-2xl mx-auto mb-12">
          <p className="text-lg md:text-xl text-gray-600 mb-2">Your idea deserves more than a sticky note.</p>
          <p className="text-lg md:text-xl text-gray-600">
            Launch a full brand, website, and marketing strategy—automatically.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center z-50 relative items-center mb-16 w-[95%]">
          <Button onClick={() => window.open('https://www.brandcom.store/', '_blank')} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
            Get started for free
          </Button>
          <Button onClick={() => window.open('https://www.brandcom.store/', '_blank')} size="lg" variant="neutral" className="border-gray-300 text-black px-8 py-3 text-lg bg-transparent">
            Request a demo
          </Button>
        </div>
      </section>

      <img src={image} alt="" className=" mx-auto object-cover" />
    </div>
  )
}
