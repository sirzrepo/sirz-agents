
import Button from "../../../components/common/ui/Button"
import image from '/public/heroBg.svg'

export default function Hero() {
  return (
    <div className="min-h-screen sm:w-[80%] w-[95%] mx-auto">

      {/* Hero Section */}
      <section className="px-6 py-16 mx-auto text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
          THINK IT. CLICK IT. BUILD IT.
        </h1>

        <div className="max-w-2xl mx-auto mb-12">
          <p className="text-lg md:text-xl text-gray-600 mb-2">Your idea deserves more than a sticky note.</p>
          <p className="text-lg md:text-xl text-gray-600">
            Launch a full brand, website, and marketing strategy—automatically.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
            Get started for free
          </Button>
          <Button size="lg" variant="neutral" className="border-gray-300 text-black px-8 py-3 text-lg bg-transparent">
            Request a demo
          </Button>
        </div>
      </section>

      <img src={image} alt="" className=" mx-auto object-cover" />
    </div>
  )
}
