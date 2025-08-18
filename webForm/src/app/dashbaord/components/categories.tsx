import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import Link from "next/link"

const categories = [
  { name: "Furniture", icon: "🪑", count: "2.3k items" },
  { name: "Electronics", icon: "📱", count: "1.8k items" },
  { name: "Vehicles", icon: "🚗", count: "1.2k items" },
  { name: "Clothing", icon: "👕", count: "4.1k items" },
  { name: "Books", icon: "📚", count: "950 items" },
  { name: "Fashion", icon: "👗", count: "680 items" },
  { name: "Home & Garden", icon: "🏡", count: "1.2k items" },
  { name: "Sports", icon: "⚽", count: "680 items" },
]

export default function Categories() {

const categoriesRef = useRef(null);
const isInViewCategories = useInView(categoriesRef, { once: true, amount: 0.2 });

  return (
    <motion.section 
    ref={categoriesRef} 
    initial="hidden" 
    animate={isInViewCategories ? "visible" : "hidden"} 
    className="py-16 px-4"
    style={{
      opacity: isInViewCategories ? 1 : 0,
      y: isInViewCategories ? 0 : 20,
      transition: "opacity 0.6s ease-in-out, y 0.6s ease-in-out",
    }}
  >
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold dark:text-white text-gray-700 mb-4">Shop by Category</h2>
        <p className="dark:text-gray-300 text-gray-700">Discover thousands of items across popular categories</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => (
          <Link key={category.name} href={`#`} className=" cursor-not-allowed">
            <Card key={category.name} className="hover:shadow-lg dark:border-white/20 transition-shadow cursor-not-allowed group">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category.count}</p>
                </CardContent>
              </Card>
          </Link>
        ))}
      </div>
    </div>
  </motion.section>
  )
}
