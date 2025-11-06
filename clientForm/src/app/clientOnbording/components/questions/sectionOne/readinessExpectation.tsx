"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function ReadinessExpectations({
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
        launchDate: "",
        readyToTakeAction: "",
        lookingForOngoingSupport: ""
    },
  )

  const booleanOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ]

  const partnershipOptions = [
    { value: "One-time setup", label: "One-time setup" },
    { value: "Ongoing support", label: "Ongoing support" },
  ]


  useEffect(() => {
    const answeredCount = Object.values(formData).filter((value) => value.trim() !== "").length
    onProgressUpdate?.(answeredCount)
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

  const handleSave = () => {
    onSaveData?.(formData)
    onComplete?.()
  }

  return (
    <div className="space-y-12 bg-white rounded-lg p-6">
    {/* Launch Date */}
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-900 mb-2">When would you ideally like to start working with us?</label>
      <input
            type="date"
            name="launchDate"
            value={formData.launchDate}
            onChange={handleDateChange}
            className="h-10 w-full text-gray-700 border border-gray-300 rounded-md"
          />
    </div>

    {/* Readiness to Take Action */}
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-900 mb-2">Are you ready to take immediate steps if we provide the right solution?</label>
      <div className="mt-2 space-x-6 flex px-6">
        {booleanOptions.map(option => (
          <label key={option.value} className="inline-flex items-center">
            <input
              type="radio"
              name="readyToTakeAction"
              value={option.value}
              checked={formData.readyToTakeAction === option.value}
              onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="ml-2 text-gray-700">{option.label}</span>
        </label>
      ))}
      </div>
    </div>

    {/* Looking for Ongoing Support */}
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-900 mb-2">Are you looking for a one-time setup or ongoing support to grow your business?</label>
      <div className="mt-2 flex flex-col px-6">
        {partnershipOptions.map(option => (
          <label key={option.value} className="inline-flex items-center">
            <input
              type="radio"
              name="lookingForOngoingSupport"
              value={option.value}
              checked={formData.lookingForOngoingSupport === option.value}
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
