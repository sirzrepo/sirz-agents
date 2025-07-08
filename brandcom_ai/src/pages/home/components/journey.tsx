import journeyImg from '../../../../public/Group 1000004272.svg'
import devImg from '../../../../public/Vector.svg'
import growImg from '../../../../public/streamline_decent-work-and-economic-growth-solid.svg'

export default function Journey() {
    return (
        <section className="pt-20 pb-10 sm:w-[80%] w-[90%] mx-auto">
        <div className="mb-8">
          <p className="text-orange-500 font-medium mb-2">Your Brandcom Journey</p>
          <div className="md:flex justify-between items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Your Idea. Built
            <br />
            Step By Step.
          </h2>
            <p className="text-lg md:text-2xl text-gray-600 md:w-[30%]">
              From idea to launch—watch your business come to life, step by step.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Dashboard Preview */}
          <img src={journeyImg} alt="" className="object-cover" />

          {/* Right Side - Process Steps */}
          <div className="space-y-8">
            {/* Initial Development Phase */}
            <div className="flex items-start gap-6 border-l-4 py-6 ps-6">
              <img src={devImg} alt="" />
              <div className="sm:w-[70%] w-[80%]">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Initial Development Phase</h3>
                <p className="text-gray-600 leading-relaxed">
                  Turn your idea into a brand with real-time validation, AI-powered identity creation, and a fully
                  launched website—all in minutes.
                </p>
              </div>
            </div>

            {/* Continuous Growth Phase */}
            <div className="flex items-start gap-6 border-l-4 py-6 ps-6">
              <img src={growImg} alt="" />
              <div className="sm:w-[70%] w-[80%]">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Continuous Growth Phase</h3>
                <p className="text-gray-600 leading-relaxed">
                  As you grow, Brandcom connects you to Shopify, TikTok Shop, and top ad platforms—Google, TikTok, and
                  Amazon. Get smart, region-based insights to track profitability and scale with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Meet Your Smart Brand Toolkit</h2>
            <p className="text-2xl text-gray-600 sm:w-[40%] mx-auto">Built-in tools that do the heavy lifting—so you can focus on the big picture.</p>
        </div>
      </section>
    )
}