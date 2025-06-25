import { AiIcon } from "../../../assets"
import { scrollToElement } from "../../../utils"

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)] px-4 my-10">
      <div className="flex space-x-2 mb-16">
        <div className="text-[#737373] font-bold text-sm flex items-center space-x-2 gap-2 bg-white px-4 py-2 rounded-md">
          <img src={AiIcon} alt="" className="w-6 h-6" />
          SIRz AI SEO Keywords Generator
          </div>
      </div>

      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center max-w-6xl mb-6">
      Turn Searches into Sales with AI‑Powered Keyword Insights
      </h1>

      <p className="text-gray-500 text-center max-w-3xl mb-12 text-lg">
      Sirz SEO Agent finds high‑intent search terms, maps them to your buyer&apos;s journey, and delivers actionable insights — so you attract traffic that converts.
      </p>

      <section className="flex space-x-2">
        <div onClick={() => scrollToElement('agent-section')} className="">
            <button className="bg-colorBlueDeep border-colorBlueDeep border hover:bg-blue-700 text-white sm:px-8 px-6 sm:py-4 py-3 sm:text-lg text-sm rounded-md">Book a demo</button>
        </div>
        <div onClick={() => scrollToElement('contact-section')} className="">
            <button className="border-colorBlueDeep hover:bg-blue-100 text-colorBlueDeep border-2 sm:px-8 px-6 sm:py-4 py-3 sm:text-lg text-sm rounded-md">Get started</button>
        </div>
      </section>
    </div>
  )
}
