import { formatRelativeTime } from "@/utils/formatters";
import { ArrowRight, CalendarIcon } from "lucide-react";
import Image from "next/image";
import { motion } from 'framer-motion';

export default function NewsCard(news: any) {
    console.log("news", news)
    return(
<motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full"
                  >
                    {news.featuredImageUrl ? (
                      <Image 
                        src={news?.featuredImageUrl} 
                        alt={news.title} 
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
                      <div>
                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                          <CalendarIcon className="inline w-4" /> 
                          {formatRelativeTime(news.publishedAt || news._creationTime)}
                        </p>
                        <h3 className="font-bold text-lg mb-2">{news.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{news.summary}</p>
                      </div>
                      <div className="mt-auto">
                        <span className="text-primary font-medium text-sm">Read more <ArrowRight className="inline w-4" /></span>
                      </div>
                    </div>
                  </motion.div>
    )
}