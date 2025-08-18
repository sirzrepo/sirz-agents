import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { User, Plus, Users, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const howItWorks = [
  {
    step: 1,
    title: "Create Your Account",
    description: "Sign up for free and verify your identity to build trust with other users.",
    icon: User,
  },
  {
    step: 2,
    title: "List Your Items",
    description: "Upload high-quality photos and detailed descriptions of items you want to sell.",
    icon: Plus,
  },
  {
    step: 3,
    title: "Connect with Buyers",
    description: "Chat with interested buyers, negotiate prices, and arrange safe meetups.",
    icon: Users,
  },
  {
    step: 4,
    title: "Complete the Sale",
    description: "Meet in safe locations, verify items, and complete transactions securely.",
    icon: CheckCircle,
  },
]

export default function HowItWorks() {
    const howItWorksRef = useRef(null);
    const isInViewHowItWorks = useInView(howItWorksRef, { once: true, amount: 0.2 });
    return (
        <motion.section 
        ref={howItWorksRef} 
        initial="hidden" 
        animate={isInViewHowItWorks ? "visible" : "hidden"} 
        className="py-16 px-4"
        style={{
          opacity: isInViewHowItWorks ? 1 : 0,
          y: isInViewHowItWorks ? 0 : 20,
          transition: "opacity 0.6s ease-in-out, y 0.6s ease-in-out",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold dark:text-white mb-4">How Rekobo Works</h2>
            <p className="dark:text-gray-300 text-gray-700 text-lg max-w-2xl mx-auto">
              Getting started is simple. Follow these four easy steps to begin buying or selling on Nigeria&apos;s most
              trusted marketplace.
            </p>
          </div>

          {/* Desktop Grid View */}
          <div className="hidden md:grid md:grid-cols-4 gap-8">
            {howItWorks.map((step) => (
              <Card key={`desktop-${step.step}`} className="dark:bg-gray-900/90 backdrop-blur-md shadow-lg dark:shadow-none dark:border-gray-700/50 text-center h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="w-16 h-16 bg-[#088b56] rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm text-[#088b56] font-semibold mb-2">STEP {step.step}</div>
                  <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                  <p className="dark:text-gray-300 text-gray-700 text-sm flex-grow">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile Slider */}
          <div className="md:hidden relative px-2">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1.1}
              centeredSlides={false}
              loop={true}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                clickable: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                },
                768: {
                  slidesPerView: 2.5,
                },
              }}
              className="py-4"
            >
              {howItWorks.map((step) => (
                <SwiperSlide key={`mobile-${step.step}`}>
                  <Card className="dark:bg-gray-900/90 backdrop-blur-md shadow-lg dark:shadow-none dark:border-gray-700/50 text-center h-full">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="w-16 h-16 bg-[#088b56] rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-sm text-[#088b56] font-semibold mb-2">STEP {step.step}</div>
                      <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                      <p className="dark:text-gray-300 text-gray-700 text-sm">{step.description}</p>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom Navigation Buttons */}
            <button 
              className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            <button 
              className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10  rounded-full p-2 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
          </div>
        </div>
      </motion.section>
    )
}
                