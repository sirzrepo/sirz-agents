
import { useState } from "react"

import slideImg1 from "../../../../public/Frame 1618873330 (1).svg"
import slideImg2 from "../../../../public/Frame 1618873330 (2).svg"
import slideImg3 from "../../../../public/Frame 1618873330 (3).svg"
import slideImg4 from "../../../../public/Frame 1618873330 (4).svg"
import slideImg5 from "../../../../public/Frame 1618873330.svg"

// Define a type for image data
interface ImageData {
  src: string
  alt: string
  title: string
  description: string
}

// Sample image data
const images: ImageData[] = [
  {
    src: slideImg1,
    alt: "A serene landscape with mountains and a lake under a clear sky.",
    title: "Majestic Mountain Lake",
    description:
      "Experience the breathtaking beauty of nature with this stunning view of a tranquil mountain lake surrounded by towering peaks. Perfect for a peaceful escape.",
  },
  {
    src: slideImg2,
    alt: "Close-up of a vibrant red flower with dew drops on its petals.",
    title: "Vibrant Blossom",
    description:
      "A close-up shot revealing the intricate details and vivid colors of a blooming flower, adorned with morning dew. A true marvel of botanical artistry.",
  },
  {
    src: slideImg3,
    alt: "Modern city skyline at sunset with illuminated skyscrapers.",
    title: "Urban Sunset",
    description:
      "The dynamic cityscape bathed in the warm glow of the setting sun, showcasing architectural grandeur and urban energy. A perfect blend of light and shadow.",
  },
  {
    src: slideImg4,
    alt: "Delicious plate of pasta with fresh basil, tomatoes, and parmesan cheese.",
    title: "Gourmet Pasta Dish",
    description:
      "Indulge in this exquisite pasta dish, prepared with fresh, high-quality ingredients and bursting with authentic flavors. A culinary delight for any occasion.",
  },
  {
    src: slideImg5,
    alt: "Abstract art with swirling blue, green, and purple colors.",
    title: "Abstract Swirls",
    description:
      "A captivating abstract piece featuring a harmonious blend of swirling colors, inviting contemplation and imagination. A modern touch for any space.",
  },
]

export default function Highlights() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const currentImage = images[selectedIndex]

  return (
    <div className="w-full mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        {/* Main Image Display */}
        <div className="relative lg:aspect-[24/9] aspect-[10/9] overflow-hidden rounded-lg bg-muted">
          {/* Previous Image */}
          <div className="absolute  lg:flex hidden items-center justify-center bottom-0 top-0 left-[-8em]">
            <div className="h-[450px]">
            <img
              src={images[selectedIndex > 0 ? selectedIndex - 1 : images.length - 1].src || "/placeholder.svg"}
              alt={images[selectedIndex > 0 ? selectedIndex - 1 : images.length - 1].alt}
              className="object-cover w-full h-full"
            />
            </div>
          </div>

          {/* Main Image */}
          <div className="absolute inset-0  flex items-center justify-center">
            <div className="h-[650px]">
                <img
                src={currentImage.src || "/placeholder.svg"}
                alt={currentImage.alt}
                className="object-contain w-full h-full"
                />
            </div>
            {/* Text Overlay */}
            <div className="absolute bottom-0 flex flex-col items-center justify-center top-0 left-0 right-0 p-4 text-[#FAFAFA]">
              <h2 className="text-2xl md:text-7xl font-bold text_shadow tracking-tight mb-1">{currentImage.title}</h2>
            </div>
          </div>

          {/* Next Image */}
          <div className="absolute lg:flex hidden items-center justify-center bottom-0 top-0 right-[-8em]">
            <div className="h-[400px]">
                <img
                src={images[selectedIndex < images.length - 1 ? selectedIndex + 1 : 0].src || "/placeholder.svg"}
                alt={images[selectedIndex < images.length - 1 ? selectedIndex + 1 : 0].alt}
                className="object-cover w-full h-full"
                />
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 md:max-w-6xl max-w-[90vw] overflow-x-scroll mx-auto py-2 px-1">
          {images.map((image, index) => (
            <div>
                <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={
                        `relative md:aspect-[4/3] aspect-[10/9] w-full overflow-hidden rounded-md border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary,
                        index === selectedIndex
                        ? "border-primary ring-2 ring-primary"
                        : "border-transparent hover:border-muted-foreground`
                    }
                    aria-label={`Select image ${index + 1}: ${image.title}`}
                    >
                    <img
                        src={image.src || "/placeholder.svg"}
                        alt={`Thumbnail for ${image.alt}`}
                        className="object-cover " // Thumbnails can be cropped to fit
                    />
                </button>
              <div className="text-black max-md:hidden whitespace-nowrap text-center">{image.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
