"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function ContentNeeds({
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
        contentNeed: "",
        brandAssets: "",
        publishFrequency: "",
        brandStyle: "",
    },
  )

  const publishFrequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ]
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
    <div className="space-y-6 bg-white rounded-lg p-6">
      {/* Content Need */}
      <div className="">
        <label className="block text-sm font-semibold text-gray-900 mb-2">What kind of content do you want SIRZ to help you create? (social posts, ads, videos, emails, etc.)</label>
        <textarea
          name="contentNeed"
          value={formData.contentNeed}
          onChange={handleChange}
          placeholder="Describe your experience with relevant brands or organizations"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>


      <div className="">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Do you have any pictures, videos, or brand assets ready for content creation?</label>
        <div className="mt-2 space-x-6 flex px-6">
          {booleanOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="brandAssets"
                value={option.value}
                checked={formData.brandAssets === option.value}
                onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700">{option.label}</span>
          </label>
        ))}
        </div>
      </div>

      {/* Working Experience */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">How often would you like to publish content or run campaigns?</label>
        <div className="flex flex-col px-6">
          {publishFrequencyOptions.map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                name="publishFrequency"
                value={option.value}
                checked={formData.publishFrequency.includes(option.value)}
                onChange={handleChange}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Education Background */}
      <div className="">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Do you have a preferred style or tone for your brand?</label>
        <div className="mt-2 space-x-6 flex px-6">
          {booleanOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="brandStyle"
                value={option.value}
                checked={formData.brandStyle === option.value}
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
        {isSubmitting ? 'Saving...' : 'Save Experience'}
      </button>
    </div>
    )
}
