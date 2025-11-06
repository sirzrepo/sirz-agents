"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function MarketingGoals({
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
        nearFutureGoal: "",
        marketingChannels: "",
        adsExperience: "",
        focusedSales: "",
    },
  )

  const platformPreferenceOptions = [
    { value: "shopify", label: "Shopify" },
    { value: "amazon", label: "Amazon" },
    { value: "tiktok", label: "TikTok" },
    { value: "ebay", label: "eBay" },
    { value: "etsy", label: "Etsy" },
  ]
  const booleanOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ]

  const focusOptions = [
    { value: "shortTermSales", label: "Short-term sales" },
    { value: "longTermGrowth", label: "Long-term growth" },
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
      {/* Brand Experience */}
      <div className="">
        <label className="block text-sm font-semibold text-gray-900 mb-2">What is your main goal for the next few months? (e.g., get more sales, grow followers, build a brand)</label>
        <textarea
          name="nearFutureGoal"
          value={formData.nearFutureGoal}
          onChange={handleChange}
          placeholder=""
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Working Experience */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Which marketing channels do you use right now? (Instagram, TikTok, Facebook Ads, email, etc.)</label>
        <div className="flex flex-col px-6">
          {platformPreferenceOptions.map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                name="marketingChannels"
                value={option.value}
                checked={formData.marketingChannels.includes(option.value)}
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
        <label className="block text-sm font-semibold text-gray-900 mb-2">Have you run ads or marketing campaigns before? If yes, what worked and what didn’t?</label>
        <div className="mt-2 flex flex-col px-6">
          {booleanOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="adsExperience"
                value={option.value}
                checked={formData.adsExperience === option.value}
                onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700">{option.label}</span>
          </label>
        ))}
        </div>

        {
          formData.adsExperience === "Yes" && (
            <textarea
              name="adsExperience"
              value={formData.adsExperience}
              onChange={handleChange}
              placeholder=""
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          )
        }
      </div>

      {/* Agency Work */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Are you focusing more on short-term sales or long-term growth?</label>
        <div className="mt-2 flex flex-col px-6">
          {focusOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="focusedSales"
                value={option.value}
                checked={formData.focusedSales === option.value}
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
