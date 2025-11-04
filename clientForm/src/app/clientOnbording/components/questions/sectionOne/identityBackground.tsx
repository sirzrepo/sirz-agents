"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function IdentityAndBackground({
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
      businessIdea: "",
      industryNiche: "",
      planningDuration: "",
      sellingPlatform: "",
    },
  )

  const sellingPlatformOptions = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
    { value: "Both", label: "Both" },
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
      {/* Business Idea */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Can you briefly tell us about your business or the idea you’re working on?</label>
        <textarea
          name="businessIdea"
          value={formData.businessIdea}
          onChange={handleChange}
          placeholder="Your business idea or products"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Industry or Niche */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Which industry or niche are you interested in?</label>
        <textarea
          name="industryNiche"
          value={formData.industryNiche}
          onChange={handleChange}
          placeholder="Your industry or niche"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Planning Duration */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">How long have you been running your business (or planning to start)?</label>
        <textarea
          name="planningDuration"
          value={formData.planningDuration}
          onChange={handleChange}
          placeholder="Duration of planning"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Looking for Ongoing Support */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Do you currently sell online, offline, or both?</label>
        <div className="mt-2 space-x-6 flex px-6">
          {sellingPlatformOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="sellingPlatform"
                value={option.value}
                checked={formData.sellingPlatform === option.value}
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
    </div>  )
}
