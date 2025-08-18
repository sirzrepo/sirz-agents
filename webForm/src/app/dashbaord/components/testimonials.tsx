"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Adebayo Johnson",
    role: "Electronics Seller",
    avatar: "https://randomuser.me/api/portraits/men/80.jpg",
    content:
      "I've sold over 200 items on Naija Panteka. The platform is secure, user-friendly, and has helped me build a successful online business.",
    rating: 5,
    location: "Lagos",
  },
  {
    name: "Sarah Okafor",
    role: "Property Buyer",
    avatar: "https://randomuser.me/api/portraits/women/89.jpg",
    content:
      "Found my dream apartment through Naija Panteka. The verification system gave me confidence in the sellers, and the process was seamless.",
    rating: 5,
    location: "Abuja",
  },
  {
    name: "Michael Eze",
    role: "Car Dealer",
    avatar: "https://randomuser.me/api/portraits/men/83.jpg",
    content:
      "As a car dealer, Naija Panteka has expanded my reach across Nigeria. The booking system helps secure serious buyers.",
    rating: 5,
    location: "Port Harcourt",
  },
]

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
  hidden: { opacity: 0, y: 50 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export default function Testimonials() {
    const controls = useAnimation()
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    useEffect(() => {
      if (isInView) {
        controls.start("show")
      }
    }, [controls, isInView])

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
                    <h2 className="text-3xl font-bold dark:text-white text-gray-700 mb-4">What Our Users Say</h2>
                    <p className="dark:text-gray-300 text-gray-700 text-lg max-w-2xl mx-auto">
                        Join thousands of satisfied buyers and sellers across Nigeria
                    </p>
                </motion.div>

                <motion.div 
                  className="grid md:grid-cols-3 gap-8" 
                  ref={ref}
                  variants={container}
                  initial="hidden"
                  animate={controls}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div 
                          key={index}
                          variants={item}
                          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                          whileInView={{ 
                            opacity: 1, 
                            x: 0,
                            transition: { 
                              duration: 0.6,
                              ease: "easeOut"
                            }
                          }}
                          viewport={{ once: true, amount: 0.3 }}
                        >
                          <Card className="dark:bg-gray-900/90 backdrop-blur-md shadow-lg dark:shadow-none dark:border-gray-700/50 h-full">
                            <CardContent className="p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="dark:text-gray-300 text-gray-700 mb-6 italic">{testimonial.content}</p>
                                <div className="flex items-center">
                                    <Avatar className="w-12 h-12 mr-4">
                                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold dark:text-white text-gray-700">{testimonial.name}</div>
                                        <div className="text-sm dark:text-gray-400 text-gray-700">
                                            {testimonial.role} • {testimonial.location}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}