"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function SetupPrefrences({
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
        platformPreference: "",
        familiarOnlineStores: "",
        brandingReady: "",
    },
  )

  const platformPreferenceOptions = [
    { value: "shopify", label: "Shopify" },
    { value: "amazon", label: "Amazon" },
    { value: "tiktok", label: "TikTok" },
    { value: "ebay", label: "eBay" },
    { value: "etsy", label: "Etsy" },
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

      {/* Platform Preference */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Which platform would you like to start selling on first (Shopify, Amazon, TikTok Shop, Instagram, etc.)</label>
        <div className="flex flex-col px-6">
          {platformPreferenceOptions.map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                name="platformPreference"
                value={option.value}
                checked={formData.platformPreference.includes(option.value)}
                onChange={handleChange}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Online Store Knowledge */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Are you familiar with how online stores work, or would you like step-by-step guidance?</label>
        <textarea
          name="familiarOnlineStores"
          value={formData.familiarOnlineStores}
          onChange={handleChange}
          placeholder="Your main business goals for the next 3-6 months"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {/* Branding */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Do you have branding materials ready (logo, product images, descriptions), or do you need help creating them?</label>
        <textarea
          name="brandingReady"
          value={formData.brandingReady}
          onChange={handleChange}
          placeholder="Your main business goals for the next 3-6 months"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
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
