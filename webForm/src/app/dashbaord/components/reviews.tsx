import { Card, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"

export default function Reviews() {

    const reviews = [
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
          avatar: "https://randomuser.me/api/portraits/men/85.jpg",
          content:
            "As a car dealer, Naija Panteka has expanded my reach across Nigeria. The booking system helps secure serious buyers.",
          rating: 5,
          location: "Port Harcourt",
        },
      ]

    return (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">What Our Users Say</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Hear from our satisfied customers about their experiences with Naija Panteka.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <Card key={index} className="bg-gray-900/90 backdrop-blur-md border-gray-700/50 text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-[#088b56]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-[#088b56]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{review.name}</h3>
                    <p className="text-gray-300 text-sm">{review.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
    )
}