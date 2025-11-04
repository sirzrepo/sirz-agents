"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function GettingStarted({
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
        whenStart: "",
        readyLaunch: "",
        supportType: "",
        successInMonths: "",
    },
  )

  const whenStartOptions = [
    { value: "now", label: "Now" },
    { value: "nextMonth", label: "Next month" },
    { value: "nextYear", label: "Next year" },
    { value: "other", label: "Other" },
  ]
  const booleanOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ]

  const supportTypeOptions = [
    { value: "oneTime", label: "One-time setup" },
    { value: "ongoing", label: "Ongoing support" },
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
        {/* Areas Help */}
        <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">When do you want to start using SIRZ for your marketing?</label>
        <div className="flex flex-col px-6">
          {whenStartOptions.map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="whenStart"
                value={option.value}
                checked={formData.whenStart === option.value}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>


      {/* Track Results */}
      <div className="">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Are you ready to launch campaigns once your content is ready?</label>
        <div className="mt-2 space-x-6 flex px-6">
          {booleanOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="readyLaunch"
                value={option.value}
                checked={formData.readyLaunch === option.value}
                onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700">{option.label}</span>
          </label>
        ))}
        </div>
      </div>

      <div className="">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Do you want ongoing support or just a one-time setup?</label>
        <div className="mt-2 space-x-6 flex px-6">
          {supportTypeOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="supportType"
                value={option.value}
                checked={formData.supportType === option.value}
                onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700">{option.label}</span>
          </label>
        ))}
        </div>
      </div>

      {/* Biggest Struggle */}
      <div className="">
        <label className="block text-sm font-semibold text-gray-900 mb-2">What would success look like for you in 3–6 months using SIRZ?</label>
        <textarea
          name="successInMonths"
          value={formData.successInMonths}
          onChange={handleChange}
          placeholder="Describe your experience with relevant brands or organizations"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
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
