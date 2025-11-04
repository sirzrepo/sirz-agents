"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function GoalsIntent({
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
        mainGoal: "",
        businessScale: "",
        successMetrics: ""
    },
  )

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
    {/* Main Goal */}
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-900 mb-2">What is your main goal over the next 3–6 months?</label>
      <textarea
        name="mainGoal"
        value={formData.mainGoal}
        onChange={handleChange}
        placeholder="Your main business goals for the next 3-6 months"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
    </div>

    {/* Business Scale */}
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-900 mb-2">Are you looking for guidance to set up your first store, or to scale an existing business?</label>
      <textarea
        name="businessScale"
        value={formData.businessScale}
        onChange={handleChange}
        placeholder="Your business scale and growth plans"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
    </div>

    {/* Success Metrics */}
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-900 mb-2">What would success look like for your business after working with SIRZ?</label>
      <textarea
        name="successMetrics"
        value={formData.successMetrics}
        onChange={handleChange}
        placeholder="Your definition of success and key metrics"
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
      {isSubmitting ? 'Saving...' : 'Save & Continue'}
    </button>
  </div> 
    )
}
