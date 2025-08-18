import Image from "next/image"
import { Button } from "@/components/ui/button"
import { List, Plus, PlusSquare, Search } from "lucide-react"
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  const itemLeft = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

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
    <section ref={ref} className="relative overflow-hidden pt-12 sm:w-[80%] sm:mx-auto min-h-screen">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" />
      <motion.div 
        className="container relative mx-auto grid items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24"
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        <motion.div className="space-y-6" variants={container}>
          <motion.div 
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-emerald-700"
            variants={itemLeft}
          >
            Escrow protected • Secure by design
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
            variants={itemLeft}
          >
            Buy and sell with confidence. We handle the trust.
          </motion.h1>
          <motion.p 
            className="max-w-prose text-lg text-slate-600 dark:text-slate-400"
            variants={itemLeft}
          >
            Rekobo is the safe layer between buyers and sellers. Funds are held in escrow until everyone&apos;s happy.
            Disputes resolved. Identities verified. Zero guesswork.
          </motion.p>
          <motion.div 
            className="flex flex-col gap-3 sm:flex-row"
            variants={itemLeft}
          >
            <Button className="h-11 rounded-md bg-emerald-600 px-6 text-white hover:bg-emerald-700">
                <Plus className="w-5 h-5" />
                Get Started
            </Button>
          </motion.div>
          <motion.div 
            className="grid grid-cols-3 gap-6 pt-6 text-sm text-slate-700 dark:text-slate-400"
            variants={itemLeft}
          >
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">150k+</p>
              <p className="text-slate-600 dark:text-slate-400">Transactions secured</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">$120M</p>
              <p className="text-slate-600 dark:text-slate-400">Escrowed safely</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">4.9/5</p>
              <p className="text-slate-600 dark:text-slate-400">Average rating</p>
            </div>
          </motion.div>
        </motion.div>
        <motion.div 
          className="relative"
          variants={itemRight}
        >
          <motion.div 
            className="absolute rounded-full blur-3xl" 
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <Image
            src="/images/hero.png"
            alt="App screenshots showing a secure marketplace experience"
            width={400}
            height={240}
            className="relative mx-auto w-full max-w-[600px] "
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
