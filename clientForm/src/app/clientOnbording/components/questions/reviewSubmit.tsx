"use client"

import { CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

interface PreviewSubmitProps {
  allSectionData: Record<string, Record<string, string>>
  completionStatus: Record<string, boolean>
  sectionConfigs: Record<string, any>
  onSubmit: () => void
}

export function PreviewSubmit({ allSectionData, completionStatus, sectionConfigs, onSubmit }: PreviewSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const allSectionsComplete = Object.values(completionStatus).every((status) => status)

  const handleSubmit = async () => {
    if (!allSectionsComplete) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitSuccess(true)
    setIsSubmitting(false)
    onSubmit()
  }

  if (submitSuccess) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">Application Submitted Successfully!</h2>
          <p className="text-green-700 mb-4">
            Thank you for completing your application. We will review your information and contact you shortly.
          </p>
          <p className="text-sm text-green-600">Application Reference: #APP-2025-001</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Application Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(sectionConfigs).map(([sectionId, config]) => (
            <div key={sectionId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  completionStatus[sectionId] ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {completionStatus[sectionId] && <span className="text-white text-xs">✓</span>}
              </div>
              <span
                className={`text-sm font-medium ${completionStatus[sectionId] ? "text-green-700" : "text-gray-600"}`}
              >
                {config.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Preview */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Your Information</h2>
        {Object.entries(allSectionData).map(([sectionId, data]) => {
          const config = sectionConfigs[sectionId]
          if (!config || !data || typeof data !== 'object' || Object.keys(data).length === 0) return null

          return (
            <div key={sectionId} className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4">{config.title}</h3>
              <div className="space-y-3">
                {Object.entries(data).map(([key, value]) => {
                  if (!value || value.trim() === "") return null
                  const label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .trim()

                  return (
                    <div key={key} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{label}</p>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{value}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Warning if incomplete */}
      {!allSectionsComplete && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-900">Incomplete Application</p>
            <p className="text-sm text-yellow-700">Please complete all sections before submitting your application.</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!allSectionsComplete || isSubmitting}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          allSectionsComplete && !isSubmitting
            ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
    </div>
  )
}
