"use client"

import type React from "react"
import { useState, useEffect } from "react"

export function InterviewQuestions({
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
      interviewDate: "",
      interviewTime: "",
      interviewerName: "",
      interviewNotes: "",
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
    const allFilled = Object.values(formData).every((value) => value.trim() !== "")
    if (allFilled) {
      onSaveData?.(formData)
      onComplete?.()
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Interview Date</label>
        <input
          type="date"
          name="interviewDate"
          value={formData.interviewDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Interview Time</label>
        <input
          type="time"
          name="interviewTime"
          value={formData.interviewTime}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Interviewer Name</label>
        <input
          type="text"
          name="interviewerName"
          value={formData.interviewerName}
          onChange={handleChange}
          placeholder="Enter interviewer's name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Interview Notes</label>
        <textarea
          name="interviewNotes"
          value={formData.interviewNotes}
          onChange={handleChange}
          placeholder="Add any notes about the interview"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Save Interview Details
      </button>
    </div>
  )
}
