// "use client"

// import { useState, useRef, useEffect } from "react"

// interface ImageZoomProps {
//   src: string
//   alt: string
//   className?: string
//   zoomLevel?: number
// }

// export default function ImageZoom({ src, alt, className = "", zoomLevel = 2.5 }: ImageZoomProps) {
//   const [isHovering, setIsHovering] = useState(false)
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
//   const [imageLoaded, setImageLoaded] = useState(false)
//   const imageRef = useRef<HTMLImageElement>(null)
//   const containerRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!containerRef.current || !isHovering) return

//       const rect = containerRef.current.getBoundingClientRect()
//       const x = ((e.clientX - rect.left) / rect.width) * 100
//       const y = ((e.clientY - rect.top) / rect.height) * 100

//       setMousePosition({ x, y })
//     }

//     const handleMouseEnter = () => setIsHovering(true)
//     const handleMouseLeave = () => setIsHovering(false)

//     const container = containerRef.current
//     if (container) {
//       container.addEventListener("mousemove", handleMouseMove)
//       container.addEventListener("mouseenter", handleMouseEnter)
//       container.addEventListener("mouseleave", handleMouseLeave)
//     }

//     return () => {
//       if (container) {
//         container.removeEventListener("mousemove", handleMouseMove)
//         container.removeEventListener("mouseenter", handleMouseEnter)
//         container.removeEventListener("mouseleave", handleMouseLeave)
//       }
//     }
//   }, [isHovering])

//   return (
//     <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
//       {/* Main Image */}
//       <img
//         ref={imageRef}
//         src={src || "/placeholder.svg"}
//         alt={alt}
//         className="w-full h-full object-cover transition-transform duration-200 ease-out"
//         style={{
//           transform: isHovering && imageLoaded ? `scale(${zoomLevel})` : "scale(1)",
//           transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
//         }}
//         onLoad={() => setImageLoaded(true)}
//       />

//       {/* Zoom Lens */}
//       {isHovering && imageLoaded && (
//         <div
//           className="absolute pointer-events-none border-2 border-white shadow-lg rounded-full opacity-30"
//           style={{
//             width: "120px",
//             height: "120px",
//             left: `calc(${mousePosition.x}% - 60px)`,
//             top: `calc(${mousePosition.y}% - 60px)`,
//             background: "rgba(255, 255, 255, 0.1)",
//             backdropFilter: "blur(1px)",
//           }}
//         />
//       )}

//       {/* Zoom Indicator */}
//       {isHovering && imageLoaded && (
//         <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
//           {zoomLevel}x Zoom
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import { useState, useRef, useEffect, useCallback } from "react"

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
  zoomLevel?: number
}

export default function ImageZoom({ src, alt, className = "", zoomLevel = 2.5 }: ImageZoomProps) {
  const [isZooming, setIsZooming] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [touchStartTime, setTouchStartTime] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchTimeoutRef = useRef<NodeJS.Timeout>()

  // Detect if device supports touch
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100

    // Clamp values to prevent zoom from going outside image bounds
    const clampedX = Math.max(10, Math.min(90, x))
    const clampedY = Math.max(10, Math.min(90, y))

    setPosition({ x: clampedX, y: clampedY })
  }, [])

  // Mouse events for desktop
  useEffect(() => {
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!isZooming) return
      updatePosition(e.clientX, e.clientY)
    }

    const handleMouseEnter = () => setIsZooming(true)
    const handleMouseLeave = () => setIsZooming(false)

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove)
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [isZooming, isTouchDevice, updatePosition])

  // Touch events for mobile
  useEffect(() => {
    if (!isTouchDevice) return

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      setTouchStartTime(Date.now())
      const touch = e.touches[0]
      updatePosition(touch.clientX, touch.clientY)

      // Clear any existing timeout
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current)
      }

      // Start zoom after a short delay (long press effect)
      touchTimeoutRef.current = setTimeout(() => {
        setIsZooming(true)
      }, 200)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (!isZooming) return

      const touch = e.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      const touchDuration = Date.now() - touchStartTime

      // Clear timeout if touch ended quickly
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current)
      }

      // If it was a quick tap (less than 200ms), toggle zoom
      if (touchDuration < 200) {
        setIsZooming(!isZooming)
      } else {
        // If it was a long press, end zoom
        setIsZooming(false)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: false })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current)
      }
    }
  }, [isZooming, isTouchDevice, touchStartTime, updatePosition])

  const lensSize = isTouchDevice ? 80 : 120 // Larger lens for touch devices

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Main Image */}
      <img
        ref={imageRef}
        src={src || "/placeholder.svg"}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 ease-out select-none"
        style={{
          transform: isZooming && imageLoaded ? `scale(${zoomLevel})` : "scale(1)",
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
        onLoad={() => setImageLoaded(true)}
        draggable={false}
      />

      {/* Touch Instructions Overlay (Mobile Only) */}
      {isTouchDevice && !isZooming && imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Tap to zoom • Hold & drag to explore
          </div>
        </div>
      )}

      {/* Zoom Lens */}
      {isZooming && imageLoaded && (
        <div
          className="absolute pointer-events-none border-2 border-white shadow-lg rounded-full transition-all duration-200"
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            left: `calc(${position.x}% - ${lensSize / 2}px)`,
            top: `calc(${position.y}% - ${lensSize / 2}px)`,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(1px)",
            boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        />
      )}

      {/* Zoom Indicator */}
      {isZooming && imageLoaded && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {zoomLevel}x Zoom
        </div>
      )}

      {/* Mobile Zoom Controls */}
      {isTouchDevice && isZooming && imageLoaded && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
          Drag to explore • Tap to exit
        </div>
      )}

      {/* Desktop Instructions */}
      {!isTouchDevice && !isZooming && imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium">Hover to zoom</div>
        </div>
      )}
    </div>
  )
}

