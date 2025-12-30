"use client"

import { BASE_URL } from "@/lib/utils"
import axios from "axios"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

interface PreviewSubmitProps {
  allSectionData: Record<string, Record<string, string>>
  completionStatus: Record<string, boolean>
  sectionConfigs: Record<string, any>
  onSubmit: () => void
  formData: any
  userId: string | null
}

export function PreviewSubmit({ allSectionData, completionStatus, sectionConfigs, onSubmit, formData, userId }: PreviewSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Get the relevant sections based on whether the user has a store
  const hasStore = formData.ecommerceExperience?.haveStore === 'yes';
  
  // Define required sections for each path
  const requiredSections = [
    'identity',
    'goalsIntent',
    'ecommerceExperience',
    'challengesSupport',
    'readinessExpectations',
    ...(hasStore 
      ? ['aboutStore', 'marketingGoals', 'contentNeeds', 'challengesAndSupport', 'gettingStarted']
      : ['validation', 'setupPrefrences', 'strategy', 'timeline']
    )
  ];

  // Check if all required sections are complete
  const allSectionsComplete = requiredSections.every(section => {
    const sectionData = allSectionData[section];
    if (!sectionData || typeof sectionData !== 'object') return false;
    
    // Check if all fields in the section have values
    return Object.values(sectionData).every(value => 
      value !== undefined && value !== null && value !== ''
    );
  });

  const handleSubmit = async () => {
    if (!allSectionsComplete) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    try {
      const response = await axios.put(`${BASE_URL}/api/onboardingProfiles/user/onboarding-status`, {
        userId,
        onboardingStatus: "completed"
      });
      setSubmitSuccess(true)
      console.log("✅ Application form submitted:", response.data);
      localStorage.setItem("onboarding-showDashboard", "true")
      setTimeout(() => {
        // window.location.href = "https://client.sirz.co.uk/";
        window.location.href = "https://onboarding-pwqw.vercel.app/"
      }, 2000);
    } catch (error) {
      setIsSubmitting(false)
      console.log("❌ Application form submission failed:", error);
    }
    // onSubmit()
  }
      
  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Application Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
