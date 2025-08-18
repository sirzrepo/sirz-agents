import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

export default function Advert() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
      });
    const itemRight = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { 
          opacity: 1, 
          scale: 1, 
          transition: { 
            duration: 0.8, 
            ease: 'easeOut' 
          } 
        }
      };
        
    return (
        <section className="py-8 px-4">
          <div className="sm:w-[80%] mx-auto">
            <Card className="bg-gradient-to-r from-[#088b56] to-[#067a4d] border-0">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">Boost Your Sales with Premium Listings</h2>
                    <p className="text-white/90 mb-6 text-lg">
                      Get 5x more visibility with our premium listing features. Featured placement, priority search
                      results, and enhanced analytics to maximize your sales.
                    </p>
                    <ul className="text-white/90 mb-6 space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Featured in search results
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Homepage banner placement
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Advanced analytics dashboard
                      </li>
                    </ul>
                    <Button size="lg" variant="secondary" className="bg-white cursor-not-allowed text-[#088b56] hover:bg-gray-100">
                      Upgrade to Premium
                      <TrendingUp className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                  {/* <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">5x</div>
                    <div className="text-white/90">More Visibility</div>
                  </div> */}
                   <motion.div 
                            className="relative"
                            variants={itemRight}
                          >
                            <motion.div 
                              className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-amber-200/60 blur-3xl" 
                              aria-hidden="true"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                            <Image
                              src="/images/advert.svg"
                              alt="App screenshots showing a secure marketplace experience"
                              width={800}
                              height={640}
                              className="relative mx-auto w-full max-w-[720px] "
                              priority
                            />
                          </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
    )
}