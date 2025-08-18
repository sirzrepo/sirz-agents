"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"

interface MasonryLayoutProps {
  children: React.ReactNode
  columns?: number
  gap?: number
  className?: string
}

export function MasonryLayout({ children, columns: initialColumns = 3, gap: initialGap = 16, className = "" }: MasonryLayoutProps) {
  const [columns, setColumns] = useState(initialColumns)
  const [gap, setGap] = useState(initialGap)

  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth > 600
      setColumns(isLargeScreen ? 3 : 2)
      setGap(isLargeScreen ? 16 : 8)
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const containerRef = useRef<HTMLDivElement>(null)
  const [columnHeights, setColumnHeights] = useState<number[]>([])
  const [itemPositions, setItemPositions] = useState<Array<{ x: number; y: number }>>([])

  useEffect(() => {
    const calculateLayout = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerWidth = container.offsetWidth
      const columnWidth = (containerWidth - gap * (columns - 1)) / columns

      // Initialize column heights
      const heights = new Array(columns).fill(0)
      const positions: Array<{ x: number; y: number }> = []

      // Get all child elements
      const items = Array.from(container.children) as HTMLElement[]

      items.forEach((item, index) => {
        // Find the shortest column
        const shortestColumnIndex = heights.indexOf(Math.min(...heights))

        // Calculate position
        const x = shortestColumnIndex * (columnWidth + gap)
        const y = heights[shortestColumnIndex]

        positions.push({ x, y })

        // Update column height
        heights[shortestColumnIndex] += item.offsetHeight + gap
      })

      setColumnHeights(heights)
      setItemPositions(positions)
    }

    // Initial calculation
    calculateLayout()

    // Recalculate on window resize
    const handleResize = () => {
      setTimeout(calculateLayout, 100) // Debounce
    }

    window.addEventListener("resize", handleResize)

    // Use ResizeObserver to detect when images load and change item heights
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(calculateLayout, 100)
    })

    if (containerRef.current) {
      Array.from(containerRef.current.children).forEach((child) => {
        resizeObserver.observe(child as Element)
      })
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      resizeObserver.disconnect()
    }
  }, [children, columns, gap])

  const containerHeight = Math.max(...columnHeights, 0)

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height: containerHeight }}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="absolute transition-all duration-300 ease-out"
          style={{
            transform: itemPositions[index]
              ? `translate(${itemPositions[index].x}px, ${itemPositions[index].y}px)`
              : "translate(0, 0)",
            width: `calc((100% - ${gap * (columns - 1)}px) / ${columns})`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
