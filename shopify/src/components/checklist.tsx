import ChecklistImg from '../assets/img/shopify-Group 5.png';
import { motion } from 'framer-motion';


export default function Checklist() {

    const fadeInLeft = {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6 }
    };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {"What's Inside the "}
            <span className="text-cyan-400">Free</span>
            {" Checklist?"}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            This actionable checklist is designed to help Shopify store owners identify hidden leaks in their funnel and
            turn more visitors into paying customers — fast.
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center mt-8 gap-2">
            <div className="h-1 w-32 bg-cyan-400 rounded-full"></div>
            <div className="h-1 w-8 bg-cyan-400 rounded-full"></div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Features */}
          <div className="space-y-8">
            {/* Feature 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-gray-200">
                  <span className="text-2xl font-bold text-black">1</span>
                </div>
              </div>
              <div className="pt-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Homepage Conversion Boosters</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Learn how to structure your homepage to immediately build trust and guide visitors toward your
                  products — no fluff, just results.
                </p>
              </div>
            </div>

            {/* Connecting line */}
            <div className="ml-8 w-0.5 h-8 bg-gray-200"></div>

            {/* Feature 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-gray-200">
                  <span className="text-2xl font-bold text-black">2</span>
                </div>
              </div>
              <div className="pt-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Cart Abandonment Fixes</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Discover simple tweaks you can make to reduce drop-offs at checkout and recover lost revenue
                  automatically.
                </p>
              </div>
            </div>

            {/* Connecting line */}
            <div className="ml-8 w-0.5 h-8 bg-gray-200"></div>

            {/* Feature 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-gray-200">
                  <span className="text-2xl font-bold text-black">3</span>
                </div>
              </div>
              <div className="pt-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Traffic-to-Sales Funnel Breakdown</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Understand where your traffic is coming from — and why it's not converting. Use this insight to
                  sharpen your marketing efforts.
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative">
          <motion.div 
                        className='sm:col-span-2 order-1 sm:order-2 mb-6 sm:mb-0'
                        variants={fadeInLeft}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <img src={ChecklistImg} alt="SIRz AI Agents" className=' object-cover rounded-lg shadow-md' />
                    </motion.div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full opacity-60"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-200 rounded-full opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

// export default function Component() {
//   return (
//     <section className="py-16 px-4 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
//             {"What's Inside the "}
//             <span className="text-cyan-400">Free</span>
//             {" Checklist?"}
//           </h2>
//           <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
//             This actionable checklist is designed to help Shopify store owners identify hidden leaks in their funnel and
//             turn more visitors into paying customers — fast.
//           </p>

//           {/* Decorative line */}
//           <div className="flex items-center justify-center mt-8 gap-2">
//             <div className="h-1 w-32 bg-cyan-400 rounded-full"></div>
//             <div className="h-1 w-8 bg-cyan-400 rounded-full"></div>
//           </div>
//         </div>

//         {/* Content Grid */}
//         <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
//           {/* Left side - Features */}
//           <div className="space-y-8">
//             {/* Feature 1 */}
//             <div className="flex gap-6">
//               <div className="flex-shrink-0">
//                 <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-200">
//                   <span className="text-2xl font-bold text-purple-600">1</span>
//                 </div>
//               </div>
//               <div className="pt-2">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-3">Homepage Conversion Boosters</h3>
//                 <p className="text-gray-600 text-lg leading-relaxed">
//                   Learn how to structure your homepage to immediately build trust and guide visitors toward your
//                   products — no fluff, just results.
//                 </p>
//               </div>
//             </div>

//             {/* Connecting line */}
//             <div className="ml-8 w-0.5 h-8 bg-purple-200"></div>

//             {/* Feature 2 */}
//             <div className="flex gap-6">
//               <div className="flex-shrink-0">
//                 <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-200">
//                   <span className="text-2xl font-bold text-purple-600">2</span>
//                 </div>
//               </div>
//               <div className="pt-2">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-3">Cart Abandonment Fixes</h3>
//                 <p className="text-gray-600 text-lg leading-relaxed">
//                   Discover simple tweaks you can make to reduce drop-offs at checkout and recover lost revenue
//                   automatically.
//                 </p>
//               </div>
//             </div>

//             {/* Connecting line */}
//             <div className="ml-8 w-0.5 h-8 bg-purple-200"></div>

//             {/* Feature 3 */}
//             <div className="flex gap-6">
//               <div className="flex-shrink-0">
//                 <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-200">
//                   <span className="text-2xl font-bold text-purple-600">3</span>
//                 </div>
//               </div>
//               <div className="pt-2">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-3">Traffic-to-Sales Funnel Breakdown</h3>
//                 <p className="text-gray-600 text-lg leading-relaxed">
//                   Understand where your traffic is coming from — and why it's not converting. Use this insight to
//                   sharpen your marketing efforts.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right side - Image */}
//           <div className="relative">
//             <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-cyan-400 to-cyan-500 p-1">
//               <div className="rounded-xl overflow-hidden">
//                 <Image
//                   src="/analytics-dashboard.png"
//                   alt="Analytics dashboard showing e-commerce metrics and charts"
//                   width={600}
//                   height={400}
//                   className="w-full h-auto object-cover"
//                 />
//               </div>
//             </div>

//             {/* Decorative elements */}
//             <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full opacity-60"></div>
//             <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-200 rounded-full opacity-40"></div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
