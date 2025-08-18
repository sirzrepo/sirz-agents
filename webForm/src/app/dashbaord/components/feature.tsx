import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Wallet, Gavel, Search, Upload, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Features() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemLeft = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const itemRight = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section ref={ref} id="features" className="border-t bg-white dark:bg-gray-900 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge className="bg-emerald-600 hover:bg-emerald-700">Why Rekobo</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Built for buyers and sellers</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Fair, transparent, and secure. We mediate every step—so deals close smoothly and everyone wins.
          </p>
        </div>

        <motion.div 
          className="grid gap-6 sm:w-[80%] mx-auto md:grid-cols-2"
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          <motion.div variants={itemLeft}>
            <Card className="py-6">
              <CardHeader>
                <CardTitle className="text-emerald-700">For Buyers</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Feature icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />} title="Escrow protection"
                  desc="Your payment is held securely until the item arrives as described." />
                <Feature icon={<Search className="h-5 w-5 text-emerald-600" />} title="Verified sellers"
                  desc="Profiles, ratings, and ID checks reduce the risk of fraud." />
                <Feature icon={<Gavel className="h-5 w-5 text-emerald-600" />} title="Dispute resolution"
                  desc="If something goes wrong, our mediators help resolve it fast." />
                <Feature icon={<Truck className="h-5 w-5 text-emerald-600" />} title="Tracked shipping"
                  desc="Integrated shipping labels and live tracking updates." />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemRight}>
            <Card className="py-6">
              <CardHeader>
                <CardTitle className="text-amber-700">For Sellers</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Feature icon={<Upload className="h-5 w-5 text-amber-600" />} title="Instant listings"
                  desc="Create polished listings with photos and smart descriptions." />
                <Feature icon={<ShieldCheck className="h-5 w-5 text-amber-600" />} title="Chargebacks reduced"
                  desc="Funds are released only after buyer confirms, minimizing disputes." />
                <Feature icon={<Wallet className="h-5 w-5 text-amber-600" />} title="Fast payouts"
                  desc="Get paid to your bank or wallet as soon as the deal closes." />
                <Feature icon={<Search className="h-5 w-5 text-amber-600" />} title="Smart discovery"
                  desc="Targeted exposure puts your items in front of ready buyers." />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">{title}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
      </div>
    </div>
  )
}
