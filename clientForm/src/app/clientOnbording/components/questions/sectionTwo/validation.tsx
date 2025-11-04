"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function Validation({
  initialData,
  onComplete,
  onProgressUpdate,
  onSaveData,
}: {
  initialData?: Record<string, string>
  onComplete?: () => void
  onProgressUpdate?: (answeredCount: number) => void
  onSaveData?: (data: Record<string, string>) => void
}) {
   const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(
    initialData || {
        product: "",
        validatedIdea: "",
        suppliersInventory: ""
    },
  )

  const booleanOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ]

  useEffect(() => {
    const answeredCount = Object.values(formData).filter((value) => value.trim() !== "").length
    onProgressUpdate?.(answeredCount)
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    onSaveData?.(formData)
    onComplete?.()
  }

  return (
    <div className="space-y-12 bg-white rounded-lg p-6">
      
      {/* Product */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">What product or service are you planning to sell first?</label>
        <textarea
          name="product"
          value={formData.product}
          onChange={handleChange}
          placeholder="Your main business goals for the next 3-6 months"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {/* Validated Idea */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Have you tested or validated this idea with potential customers?</label>
        <div className="mt-2 space-x-6 flex px-6">
          {booleanOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="validatedIdea"
                value={option.value}
                checked={formData.validatedIdea === option.value}
                onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700">{option.label}</span>
          </label>
        ))}
        </div>
      </div>

      {/* Suppliers Inventory */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Do you already have suppliers, inventory, or a plan to source your products?</label>
        <div className="mt-2 space-x-6 flex px-6">
          {booleanOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="suppliersInventory"
                value={option.value}
                checked={formData.suppliersInventory === option.value}
                onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700">{option.label}</span>
          </label>
        ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSave}
        disabled={isSubmitting}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors ${
          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Saving...' : 'Save & Continue'}
      </button>
    </div>
    )
}
