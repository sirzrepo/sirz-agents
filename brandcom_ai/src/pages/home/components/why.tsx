import FeatureCard from "../../../components/featureCard";
import websiteIcon from '../../../../public/Vector (1).svg'
import ideaIcon from '../../../../public/Vector (2).svg'
import adIcon from '../../../../public/Vector (3).svg'
import marketIcon from '../../../../public/ic_baseline-insights.svg'
import brandIcon from '../../../../public/Group (1).svg'

import buriedImg from '../../../../public/Frame 1618873256.svg'
import Button from "../../../components/common/ui/Button";

export default function Why() {

    const features = [
        {
          icon: ideaIcon, // You'd typically use an SVG or an icon library here
          title: 'Idea Validation',
          description: 'Test your business idea against live market trends and consumer demand—before spending a dime.',
        },
        {
          icon: brandIcon, // You'd typically use an SVG or an icon library here
          title: 'Brand Kit',
          description: 'From logo to color palette and tone of voice, your brand identity is crafted by AI with style and strategy.',
        },
        {
          icon: websiteIcon, // You'd typically use an SVG or an icon library here
          title: 'Website Launch',
          description: 'Get a fully responsive, beautifully branded site—no code, no stress, just your idea turned into a live business.',
        },
        {
          icon: marketIcon, // You'd typically use an SVG or an icon library here
          title: 'Market Insights',
          description: 'See if your idea will fly or flop with region-based insights, trend forecasts, and profit projections.',
        },
        {
          icon: adIcon, // You'd typically use an SVG or an icon library here
          title: 'Smart Ads',
          description: 'Skip the guesswork—launch smart ads instantly with AI that finds the right audience and maximizes ROI.',
        },
      ];


    return (
        <div className=" sm:w-[80%] w-[90%] mx-auto bg-gray-50 flex flex-col items-center sm:py-32 font-sans">
            {/* Header Section */}
            <div className="text-center mb-16 sm:max-w-3xl">
                <p className="text-orange-600 font-semibold text-lg mb-2">Why Brandcom.ai?</p>
                <h1 className="text-5xl  font-extrabold text-gray-900 leading-tight">
                    Because Ideas Deserve to Be <br className="hidden sm:inline" />
                    <span className="inline-block sm:flex items-center justify-center gap-3 relative">
                    Built, Not 
                    <img src={buriedImg} alt="" />
                    {/* <span className="bg-orange-600 text-white px-3 py-1 rounded-md">Buried.</span> */}
                    </span>
                </h1>
            </div>
    
            <div>
                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mx-auto">
                {/* First three cards */}
                {features.slice(0, 3).map((feature, index) => (
                    <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    isFirstRow // Prop to conditionally apply flex-grow
                    />
                ))}
                </div>

                
                {/* Second row cards - Span more columns to center them if needed */}
                <div className="grid grid-cols-1 md:grid-cols-2 md:w-[70%] gap-10 mx-auto mt-16"> {/* Added mt-4 for separation */}
                    {features.slice(3, 6).map((feature, index) => (
                    <FeatureCard
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        isSecondRow // Prop to conditionally apply different width/sizing
                    />
                    ))}
                </div>
            </div>
    
            {/* Call to Action Button */}
            <div className="mt-16">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 text-lg transition duration-300 ease-in-out shadow-lg">
                Get started for free
            </Button>
            </div>
      </div>
  
    )
}