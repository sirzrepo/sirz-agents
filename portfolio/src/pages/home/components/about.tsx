import photo from '../../../../public/femi.svg'
import vectorBg from '../../../../public/image 1.svg'

export default function About() {
  return (
    <div
    style={{
      backgroundImage: `url(${vectorBg})`,
      backgroundSize: 'contain',
      backgroundPosition: 'left',
      backgroundRepeat: 'no-repeat',
    }}
     className=" relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.03) 2px,
            rgba(255,255,255,0.03) 4px
          )`,
          }}
        ></div>
      </div>

      <div
      
      className="relative z-10 container mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mx-auto">
          {/* Image Section */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Cyan border accent */}
              <div className="absolute rounded-lg"></div>
              <div className="relative bg-gray-900 rounded-lg ">
                <img
                  src={photo}
                  alt="Professional headshot"
                  width={400}
                  height={500}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-[1px] h-8 bg-cyan-400"></div>
                <span className="text-gray-300 font-medium text-lg">About Me</span>
              </div>

              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                Helping Brands Grow,
                Connect, And Succeed
              </h1>

              <p className="text-gray-300 text-xl font-medium">Automation Architect and RevOps Strategist</p>
            </div>

            <div className="space-y-6">
              <p className="text-gray-300 text-xl tracking-wide leading-relaxed">
                I specialize in building full stack automation systems that align marketing, sales and support
                operations into a unified data driven engine.
              </p>

              <div className="space-y-4 text-lg">
                <p className="text-gray-300 ">My approach focuses on three key pillars:</p>

                <div className="space-y-3">
                  <div className="flex text-gray-300 items-start space-x-1">
                    <span className="">1) System Architecture and Integration</span>
                  </div>
                  <div className="flex text-gray-300 items-start space-x-1">
                    <span className="">2) Process Automation Design</span>
                  </div>
                  <div className="flex text-gray-300 items-start space-x-1">
                    <span className="">3) Data Driven Optimization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
