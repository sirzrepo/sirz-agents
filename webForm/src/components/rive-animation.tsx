'use client';

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas'
import { useEffect, useRef } from 'react'

interface RiveAnimationProps {
  src: string
  className?: string
}

export function RiveAnimation({ src, className }: RiveAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: 'state-machine',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  })

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rive) return
      
      const layout = new Layout({
        fit: Fit.Cover,
        alignment: Alignment.Center,
      })
      
      rive.layout = layout
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [rive])

  return (
    <div 
      ref={containerRef} 
      className={`w-full relative aspect-video min-h-[300px] md:min-h-[400px] lg:min-h-[600px] ${className || ''}`}
    >
      <div className="absolute inset-0">
        <RiveComponent 
          className="w-full h-full object-contain" 
          style={{ 
            maxWidth: '100vw',
            maxHeight: '100vh',
          }} 
        />
      </div>
    </div>
  )
} 