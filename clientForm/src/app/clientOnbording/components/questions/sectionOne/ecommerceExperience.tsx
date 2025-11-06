"use client"

import { setHaveStore } from "@/store/haveStore"
import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"

export function EcommerceExperience({
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
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(
    initialData || {
        everSoldItems: "",
        haveStore: "",
        platformComfortable: "",
        everWorkedWithConsultant: ""
        },
  )

const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
}

  const booleanOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ]

  const haveStoreOptions = [
    { value: "yes", label: "Yes, I have an eCommerce store" },
    { value: "no", label: "No, I'm just planning to start one" },
  ]

  const platformComfortableOptions = [
    { value: "shopify", label: "Shopify" },
    { value: "amazon", label: "Amazon" },
    { value: "tiktok", label: "TikTok" },
    { value: "ebay", label: "eBay" },
    { value: "etsy", label: "Etsy" },
  ]

  useEffect(() => {
    dispatch(setHaveStore(formData.haveStore === "yes"))
  }, [formData])

  useEffect(() => {
    const answeredCount = Object.values(formData).filter((value) => value.trim() !== "").length
    onProgressUpdate?.(answeredCount)
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox' && name === 'platformComfortable') {
      const currentValues = formData.platformComfortable ? formData.platformComfortable.split(',').filter(Boolean) : [];
      const isChecked = (e.target as HTMLInputElement).checked;
      
      let newValues;
      if (isChecked) {
        newValues = [...new Set([...currentValues, value])]; // Remove duplicates
      } else {
        newValues = currentValues.filter(v => v !== value);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: newValues.join(',')
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleSave = () => {
    onSaveData?.(formData)
    onComplete?.()
  }

  return (
    <div className="space-y-12 bg-white rounded-lg p-6">
    {/* Product Validation */}
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-900 mb-2">Have you ever sold products online before? If yes, on which platforms?</label>
      <div className="mt-2 flex flex-col px-6">
        {booleanOptions.map(option => (
          <label key={option.value} className="inline-flex items-center">
            <input
              type="radio"
              name="everSoldItems"
              value={option.value}
              checked={formData.everSoldItems === option.value}
              onChange={handleRadioChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="ml-2 text-gray-700">{option.label}</span>
        </label>
      ))}
      </div>
    </div>

    {/* Business Scale */}
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        Do you already have an eCommerce store, or are you just planning to start one?
      </label>
      <div className="flex flex-col px-6">
        {haveStoreOptions.map(option => (
          <label key={option.value} className="flex items-center">
            <input
              type="radio"
              name="haveStore"
              value={option.value}
              checked={formData.haveStore === option.value}
              onChange={handleRadioChange}
              className="mr-2"
            />
            <span className="ml-2 text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Success Metrics */}
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-900 mb-2">Which tools or platforms are you familiar with (Shopify, TikTok, Instagram, Amazon, etc.)?</label>
      <div className="flex flex-col px-6">
        {platformComfortableOptions.map(option => (
          <label key={option.value} className="flex items-center">
            <input
              type="checkbox"
              name="platformComfortable"
              value={option.value}
              checked={formData.platformComfortable?.split(',').includes(option.value) || false}
              onChange={handleChange}
              className="mr-2"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>

    {/* Success Metrics */}
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-900 mb-2">Have you ever worked with a consultant or agency to grow your online sales?</label>
      <div className="mt-2 flex flex-col px-6">
        {booleanOptions.map(option => (
          <label key={option.value} className="inline-flex items-center">
            <input
              type="radio"
              name="everWorkedWithConsultant"
              value={option.value}
              checked={formData.everWorkedWithConsultant === option.value}
              onChange={handleRadioChange}
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
