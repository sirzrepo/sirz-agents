"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function AboutStore({
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
        storeName: "",
        platformPreference: "",
        onlineStoreExperience: "",
        sellLocation: "",
    },
  )

  const platformPreferenceOptions = [
    { value: "shopify", label: "Shopify" },
    { value: "amazon", label: "Amazon" },
    { value: "tiktok", label: "TikTok" },
    { value: "ebay", label: "eBay" },
    { value: "etsy", label: "Etsy" },
  ]

  const locationOptions = [
    { value: "local", label: "Local" },
    { value: "international", label: "International" },
    { value: "both", label: "Both" },
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
      {/* Store Name */}
      <div className="">
        <label className="block text-sm font-semibold text-gray-900 mb-2">What’s the name of your store, and what products do you sell?</label>
        <textarea
          name="storeName"
          value={formData.storeName}
          onChange={handleChange}
          placeholder="Describe your experience with relevant brands or organizations"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Platform Preference */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Which platform is your store on (Shopify, Amazon, WooCommerce, etc.)?</label>
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

      {/* Education Background */}
      <div className="">
        <label className="block text-sm font-semibold text-gray-900 mb-2">How long have you been selling online?</label>
        <textarea
          name="onlineStoreExperience"
          value={formData.onlineStoreExperience}
          onChange={handleChange}
          placeholder="List your educational qualifications and institutions"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Agency Work */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Do you sell mostly locally, internationally, or both?</label>
        <div className="mt-2 flex flex-col px-6">
          {locationOptions.map(option => (
            <label key={option.value} className=" items-center">
              <input
                type="radio"
                name="sellLocation"
                value={option.value}
                checked={formData.sellLocation === option.value}
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
        {isSubmitting ? 'Saving...' : 'Save Experience'}
      </button>
    </div>
    )
}
