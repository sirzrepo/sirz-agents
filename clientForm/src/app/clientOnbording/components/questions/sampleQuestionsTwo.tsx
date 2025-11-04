"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function ExperienceQuestionsTwo({
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
      brandExperience: "",
      workingExperience: "",
      educationBackground: "",
      agencyWork: "",
      careerGaps: "",
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
    <div className="space-y-6">
      {/* Brand Experience */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Brand Experience</label>
        <textarea
          name="brandExperience"
          value={formData.brandExperience}
          onChange={handleChange}
          placeholder="Describe your experience with relevant brands or organizations"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Working Experience */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Working Experience</label>
        <textarea
          name="workingExperience"
          value={formData.workingExperience}
          onChange={handleChange}
          placeholder="Describe your work history and key roles"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Education Background */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Education Background</label>
        <textarea
          name="educationBackground"
          value={formData.educationBackground}
          onChange={handleChange}
          placeholder="List your educational qualifications and institutions"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Agency Work */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Agency Work</label>
        <textarea
          name="agencyWork"
          value={formData.agencyWork}
          onChange={handleChange}
          placeholder="Describe any agency work or temporary positions"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Career Gaps */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Career Gaps</label>
        <textarea
          name="careerGaps"
          value={formData.careerGaps}
          onChange={handleChange}
          placeholder="Explain any gaps in your employment history"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Save Experience
      </button>
    </div>
  )
}
