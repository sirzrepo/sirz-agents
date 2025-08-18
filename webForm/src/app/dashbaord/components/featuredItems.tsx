"use client"

import { motion, useInView, useAnimation } from "framer-motion"
import { useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Heart, Star, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"


interface FeaturedItem {
  id: number;
  title: string;
  price: string;
  originalPrice?: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  seller: string;
  condition: string;
  featured: boolean;
}

const itemVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: i % 2 === 0 ? -50 : 50
  }),
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

export default function FeaturedItems() {

    const featuredItems: FeaturedItem[] = [
        {
          id: 1,
          title: "iPhone 14 Pro Max - 256GB",
          price: "₦850,000",
          originalPrice: "₦950,000",
          location: "Lagos, Nigeria",
          rating: 4.8,
          reviews: 24,
          image: "https://images.unsplash.com/photo-1664478546384-d57ffe74a78c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGlwaG9uZSUyMDE0JTIwcHJvJTIwbWF4fGVufDB8fDB8fHww",
          seller: "TechHub Lagos",
          condition: "Like New",
          featured: true,
        },
        {
          id: 2,
          title: "Toyota Camry 2018 - Low Mileage",
          price: "₦8,500,000",
          location: "Abuja, Nigeria",
          rating: 4.9,
          reviews: 12,
          image: "https://images.unsplash.com/photo-1710441970901-c9c2ae39a77c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwY2FtcnklMjAyMDE4fGVufDB8fDB8fHww",
          seller: "AutoDeals NG",
          condition: "Used",
          featured: true,
        },
        {
          id: 3,
          title: "3 Bedroom Apartment - Lekki",
          price: "₦45,000,000",
          location: "Lagos, Nigeria",
          rating: 4.7,
          reviews: 8,
          image: "https://images.unsplash.com/photo-1643297550841-1386b3a10612?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZHVwbGV4fGVufDB8fDB8fHww",
          seller: "Prime Properties",
          condition: "New",
          featured: true,
        },
        {
          id: 4,
          title: "MacBook Pro M2 - 512GB SSD",
          price: "₦1,200,000",
          originalPrice: "₦1,400,000",
          location: "Port Harcourt, Nigeria",
          rating: 4.6,
          reviews: 15,
          image: "https://plus.unsplash.com/premium_photo-1676998931123-75789162f170?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fG1hYyUyMGJvb2t8ZW58MHx8MHx8fDA%3D",
          seller: "GadgetZone PH",
          condition: "Excellent",
          featured: false,
        },
      ]

    const featuredRef = useRef(null);
    const controls = useAnimation();
    const isInViewFeatured = useInView(featuredRef, { once: true, amount: 0.2 });

    useEffect(() => {
      if (isInViewFeatured) {
        controls.start("show");
      }
    }, [controls, isInViewFeatured]);

    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.3
        }
      }
    };

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
    };

    return (
        <section ref={featuredRef} className="py-16 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                  className="flex justify-between items-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6 }}
                >
                <div>
                    <h2 className="text-3xl font-bold dark:text-white text-gray-700 mb-4">Featured Items</h2>
                    <p className="dark:text-gray-300 text-gray-700">Hand-picked deals from verified sellers</p>
                </div>
                <Link href="#">
                    <Button variant="outline" className="border-gray-600 dark:text-white hover:bg-gray-700 cursor-not-allowed bg-transparent">
                    View All Items
                    <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
                </motion.div> 
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  variants={container}
                  initial="hidden"
                  animate={controls}
                >
                {featuredItems.map((item: FeaturedItem, index: number) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      custom={index}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      className="h-full"
                    >
                      <Link href={`#`} className=" cursor-not-allowed">
                        <Card className="dark:bg-gray-900/90 backdrop-blur-md shadow-lg dark:shadow-none dark:border-gray-700/50 hover:border-[#088b56]/50 transition-all duration-300 cursor-not-allowed group overflow-hidden h-full">
                        <div className="relative">
                        <Image  
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.featured && (
                            <Badge className="absolute top-2 left-2 bg-[#088b56] text-white">Featured</Badge>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-white hover:text-red-500"
                        >
                            <Heart className="w-4 h-4" />
                        </Button>
                        </div>
                        <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                            {item.condition}
                            </Badge>
                            <div className="flex items-center text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm text-gray-300 ml-1">
                                {item.rating} ({item.reviews})
                            </span>
                            </div>
                        </div>
                        <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-[#088b56]">{item.price}</span>
                            {item.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
                            )}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {item.location}
                        </div>
                        <div className="text-sm text-gray-300">by {item.seller}</div>
                        </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                ))}
                </motion.div>
            </div>
        </section>
    )
}