"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function TimelineAndCommitment({
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
        timeline: "",
        timePerWeek: "",
        immediateSteps: "",
    },
  )

  const booleanOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ]

  const timelineOptions = [
    { value: "1 week", label: "1 week" },
    { value: "2 weeks", label: "2 weeks" },
    { value: "3 weeks", label: "3 weeks" },
    { value: "1 month", label: "1 month" },
    { value: "2 months", label: "2 months" },
    { value: "3 months", label: "3 months" },
  ]

  const timePerWeekOptions = [
    { value: "1 hour", label: "1 hour" },
    { value: "3 hours", label: "3 hours" },
    { value: "6 hours", label: "6 hours" },
    { value: "12 hours", label: "12 hours" },
    { value: "1 day", label: "1 day" },
    { value: "2 days", label: "2 days" },
    { value: "3 days", label: "3 days" },
    { value: "4 days", label: "4 days" },
    { value: "5 days", label: "5 days" },
    { value: "6 days", label: "6 days" },
    { value: "7 days", label: "7 days" },
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

      {/* Timeline */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">When would you ideally like to have your store up and running?</label>
        <div className="flex flex-col px-6">
          {timelineOptions.map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                name="timeline"
                value={option.value}
                checked={formData.timeline.includes(option.value)}
                onChange={handleChange}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Time Per Week */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">How much time per week can you dedicate to building and launching your store?</label>
        <div className="flex flex-col px-6">
          {timePerWeekOptions.map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                name="timePerWeek"
                value={option.value}
                checked={formData.timePerWeek.includes(option.value)}
                onChange={handleChange}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Immediate Steps */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Are you ready to take immediate steps if SIRZ provides the right guidance and tools?</label>
        <div className="mt-2 space-x-6 flex px-6">
          {booleanOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="immediateSteps"
                value={option.value}
                checked={formData.immediateSteps === option.value}
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
