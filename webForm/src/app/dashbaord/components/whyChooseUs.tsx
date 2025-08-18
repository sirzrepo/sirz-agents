"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Award, HeadphonesIcon, Lock, Shield } from "lucide-react"

export default function WhyChooseUs() {

    const trustFeatures = [
        {
          icon: Shield,
          title: "Verified Sellers",
          description: "All sellers go through our verification process to ensure authenticity and build trust.",
        },
        {
          icon: Lock,
          title: "Secure Transactions",
          description: "Advanced encryption and secure payment options protect your financial information.",
        },
        {
          icon: HeadphonesIcon,
          title: "24/7 Support",
          description: "Our customer support team is available round the clock to assist you.",
        },
        {
          icon: Award,
          title: "Quality Assurance",
          description: "We maintain high standards through our rating system and quality checks.",
        },
      ]

    const controls = useAnimation()
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    useEffect(() => {
      if (isInView) {
        controls.start("show")
      }
    }, [controls, isInView])

    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2
        }
      }
    }

    const item = {
      hidden: { opacity: 0, y: 30 },
      show: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut"
        }
      }
    }

    return (
        <section className="py-16 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold dark:text-white text-gray-700 mb-4">Why Choose Rekobo?</h2>
              <p className="dark:text-gray-300 text-gray-700 text-lg max-w-2xl mx-auto">
                We&apos;ve built Nigeria&apos;s most trusted marketplace with advanced security features and user protection.
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-4 gap-8"
              ref={ref}
              variants={container}
              initial="hidden"
              animate={controls}
            >
              {trustFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.6,
                      ease: "easeOut"
                    }
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Card className="dark:bg-gray-900/90 backdrop-blur-md shadow-lg dark:shadow-none dark:border-gray-700/50 text-center h-full">
                    <CardContent className="p-6">
                      <motion.div 
                        className="w-16 h-16 bg-[#088b56]/20 rounded-full flex items-center justify-center mx-auto mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <feature.icon className="w-8 h-8 text-[#088b56]" />
                      </motion.div>
                      <h3 className="text-lg font-semibold dark:text-white text-gray-700 mb-3">{feature.title}</h3>
                      <p className="dark:text-gray-300 text-gray-700 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

    )
}