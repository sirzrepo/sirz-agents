"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function Challenges({
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
        biggestStruggle: "",
        areasHelp: "",
        trackResults: "",
    },
  )

  const areasHelpOptions = [
    { value: "ads", label: "Ads" },
    { value: "content", label: "Content" },
    { value: "analytics", label: "Analytics" },
    { value: "automation", label: "Automation" },
    { value: "other", label: "Other" },
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
      {/* Biggest Struggle */}
      <div className="">
        <label className="block text-sm font-semibold text-gray-900 mb-2">What’s your biggest struggle with marketing your store right now?</label>
        <textarea
          name="biggestStruggle"
          value={formData.biggestStruggle}
          onChange={handleChange}
          placeholder="Describe your experience with relevant brands or organizations"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Areas Help */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Which areas do you want the most help with? (ads, content, analytics, automation, etc.)</label>
        <div className="flex flex-col px-6">
          {areasHelpOptions.map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                name="areasHelp"
                value={option.value}
                checked={formData.areasHelp.includes(option.value)}
                onChange={handleChange}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Track Results */}
      <div className="">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Do you track marketing results? If yes, which numbers matter most to you?</label>
        <div className="mt-2 flex flex-col px-6">
          {booleanOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="trackResults"
                value={option.value}
                checked={formData.trackResults === option.value}
                onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700">{option.label}</span>
          </label>
        ))}
        </div>

        {
          formData.trackResults === "Yes" && (
            <textarea
              name="trackResults"
              value={formData.trackResults}
              onChange={handleChange}
              placeholder="List your educational qualifications and institutions"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          )
        }
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
