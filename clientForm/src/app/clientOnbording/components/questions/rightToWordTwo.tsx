"use client"

import type React from "react"
import { useState, useEffect } from "react"

export function RightToWorkQuestionsTwo({
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
  const [formData, setFormData] = useState(
    initialData || {
      visaStatus: "",
      workPermit: "",
      sponsorshipRequired: "",
    },
  )

  useEffect(() => {
    const answeredCount = Object.values(formData).filter((value) => value.trim() !== "").length
    onProgressUpdate?.(answeredCount)
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    const allFilled = Object.values(formData).every((value) => value.trim() !== "")
    if (allFilled) {
      onSaveData?.(formData)
      onComplete?.()
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Visa Status</label>
        <select
          name="visaStatus"
          value={formData.visaStatus}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select your visa status</option>
          <option value="uk-citizen">UK Citizen</option>
          <option value="settled-status">Settled Status</option>
          <option value="visa">Visa</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Work Permit</label>
        <input
          type="text"
          name="workPermit"
          value={formData.workPermit}
          onChange={handleChange}
          placeholder="Enter your work permit number or details"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Sponsorship Required</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="sponsorshipRequired"
              value="yes"
              onChange={handleChange}
              className="mr-2"
              checked={formData.sponsorshipRequired === "yes"}
            />
            <span className="text-gray-700">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="sponsorshipRequired"
              value="no"
              onChange={handleChange}
              className="mr-2"
              checked={formData.sponsorshipRequired === "no"}
            />
            <span className="text-gray-700">No</span>
          </label>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Save Right to Work
      </button>
    </div>
  )
}
