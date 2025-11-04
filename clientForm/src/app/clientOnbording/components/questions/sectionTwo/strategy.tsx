"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function Strategy({
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
        promotionStrategy: "",
        adsGuidance: "",
        marketingPlan: ""
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
      
      {/* Promotion Strategy */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">How do you plan to promote your store once it’s live?</label>
        <textarea
          name="promotionStrategy"
          value={formData.promotionStrategy}
          onChange={handleChange}
          placeholder="Your main business goals for the next 3-6 months"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {/* Ads Guidance */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Would you like guidance on running ads or using organic marketing strategies?</label>
        <div className="mt-2 space-x-6 flex px-6">
          {booleanOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="adsGuidance"
                value={option.value}
                checked={formData.adsGuidance === option.value}
                onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700">{option.label}</span>
          </label>
        ))}
        </div>
      </div>

      {/* Marketing Plan */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Would you like help creating your first product listing and marketing plan?</label>
        <div className="mt-2 space-x-6 flex px-6">
          {booleanOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="marketingPlan"
                value={option.value}
                checked={formData.marketingPlan === option.value}
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
