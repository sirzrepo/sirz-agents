"use client"

import { Search, RotateCcw, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import photo from "../../../../public/images/emptyList.svg"

interface EmptyStateProps {
  title?: string
  description?: string
  image?: string
  onClearFilters?: () => void
  onAddItem?: () => void
  showAddButton?: boolean
  showClearButton?: boolean
}

export default function EmptyState({
  title = "No items found",
  description = "We couldn't find any items matching your current filters. Try adjusting your search criteria or clearing the filters.",
  onClearFilters,
  image,
  onAddItem,
  showAddButton = false,
  showClearButton = true,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="mx-auto flex items-center justify-center rounded-full bg-muted">
          {image ? 
          <Image 
            src={image} 
            alt="Empty State" 
            width={150} 
            height={150} 
          /> : 
          <Search 
            className="h-10 w-10 text-muted-foreground" 
          />}
        </div>

        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md">{description}</p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {showClearButton && onClearFilters && (
            <Button variant="outline" onClick={onClearFilters} className="gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Clear filters
            </Button>
          )}

          {showAddButton && onAddItem && (
            <Button onClick={onAddItem} className="gap-2">
              <Plus className="h-4 w-4" />
              Add new item
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
