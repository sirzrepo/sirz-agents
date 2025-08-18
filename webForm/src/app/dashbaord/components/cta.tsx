import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"
import Image from "next/image"

export default function CTA() {
    return (
        <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <Card className="bg-gradient-to-r from-[#088b56] to-[#067a4d] border-0">
                <CardContent className="p-12">
                    <ShoppingBag className="w-16 h-16 text-white mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                    <p className="text-white/90 mb-8 text-lg">
                    Join Nigeria&apos;s fastest-growing marketplace. Start buying or selling today with complete confidence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/sell">
                            <Button size="lg" variant="secondary" className="bg-white text-[#088b56] hover:bg-gray-100">
                            <Plus className="w-5 h-5 mr-2" />
                                Join the community
                            </Button>
                        </Link>
                    </div>
                </CardContent>
                </Card>
          </div>
          <div>
            <Image
              src="/images/cta.svg"
              alt="App screenshots showing a secure marketplace experience"
              width={800}
              height={640}
              className="relative mx-auto w-full max-w-[720px] "
              priority
            />
          </div>
        </section>
    )
}