import type React from "react"

import { useState } from "react"
import { Building2, ChevronRight, Users, Target, Lightbulb, Download } from "lucide-react"
import Input from "../../../components/common/ui/Input"
import Button from "../../../components/common/ui/Button"
import Label from "../../../components/common/ui/Label"
import { BASE_URL } from "../../../utils"
import axios from "axios"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { brandRegistered } from "@/store/brandSlice"
import Loader from "@/features/loader"
import { RootState } from "@/store/store"
// import FormResponseModal from "../../components/Forms/responseForm"

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Education",
  "Food & Beverage",
  "Fashion",
  "Real Estate",
  "Consulting",
  "Other",
]

export default function IdentityForm() {
  const [companyName, setCompanyName] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [targetAudience, setTargetAudience] = useState("")
  const [brandValues, setBrandValues] = useState<string[]>([])
  const [preferredStyle, setPreferredStyle] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null)
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const {userData} = useSelector((state: RootState) => state.user);

//   const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
//   const [formResponse, setFormResponse] = useState<FormResponse | null>(null);

// const handleCloseModal = () => {
//   setIsResponseModalOpen(false);
//   setFormResponse(null);
// };

  const brandValueOptions = [
    "Innovation",
    "Quality",
    "Creativity",
    "Excellence",
    "Community",
    "Trust",
    "Sustainability",
    "Reliability",
    "Authenticity",
    "Growth",
  ]

  const styleOptions = [
    "Modern & Minimalist",
    "Bold & Energetic",
    "Classic & Elegant",
    "Playful & Creative",
    "Professional & Corporate",
    "Organic & Natural",
  ]

  const handleNext = async () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      setCurrentStep(3)
    } else if (currentStep === 3) {
      setCurrentStep(4)
    } else if (currentStep === 4) {
      // Validate that required fields are filled
      if (!companyName || !selectedIndustry || !targetAudience || !preferredStyle) {
        toast.error('Please fill in all required fields before submitting');
        return;
      }
      setIsLoading(true);

      try {
        const companyData = {
          companyName,
          industry: selectedIndustry,
          targetAudience,
          brandValues,
          preferredStyle,
          additionalNotes,
          // userId: '' // Add email field if needed
        };

        console.log("Submitting company data:", companyData);
        
        const response = await axios.post(`${BASE_URL}/api/brand-data/company`, {
          userId: userData?.id, // You'll need to get this from your auth context
          ...companyData
        });
        
        dispatch(brandRegistered());
        setIsLoading(false);
        console.log("Server response:", response.data);
        toast.success("Your company data has been saved successfully!");
      } catch (error: any) {
        setIsLoading(false);
        console.error("Error details:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Error saving company data. Please try again.");
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleBrandValue = (value: string) => {
    setBrandValues((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      } else if (prev.length < 5) {
        return [...prev, value]
      }
      return prev
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedLogo(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center sm:p-4">
      <div className="w-full lg:w-[80%] bg-white rounded-2xl shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{"Let's Create Your Brand Identity"}</h1>
          <p className="text-gray-600 text-lg">Answer a few questions to help our AI understand your vision</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2">
            <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? "bg-purple-600" : "bg-gray-300"}`}></div>
            <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? "bg-purple-600" : "bg-gray-300"}`}></div>
            <div className={`w-3 h-3 rounded-full ${currentStep >= 3 ? "bg-purple-600" : "bg-gray-300"}`}></div>
            <div className={`w-3 h-3 rounded-full ${currentStep >= 4 ? "bg-purple-600" : "bg-gray-300"}`}></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {currentStep === 1 && (
            <>
              {/* Icon and Title */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                  <Building2 className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Basics</h2>
                <p className="text-gray-600">Tell us about your company and industry</p>
              </div>

              {/* Company Name Input */}
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-sm font-medium text-gray-900">
                  Company Name *
                </Label>
                <Input
                  id="company-name"
                  type="text"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Industry Selection */}
              <div className="space-y-4">
                <Label htmlFor="industry" className="text-sm font-medium text-gray-900">Industry *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => setSelectedIndustry(industry)}
                      className={`p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                        selectedIndustry === industry
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">{industry}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* Icon and Title */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Target Audience</h2>
                <p className="text-gray-600">Who are you trying to reach?</p>
              </div>

              {/* Target Audience Textarea */}
              <div className="space-y-2">
                <Label htmlFor="target-audience" className="text-sm font-medium text-gray-900">
                  Describe Your Target Audience *
                </Label>
                <textarea
                  id="target-audience"
                  placeholder="Who are your ideal customers? Include demographics, interests, and pain points..."
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  rows={8}
                  className="w-full p-4 text-base border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 focus:outline-none resize-none"
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              {/* Icon and Title */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Brand Values</h2>
                <p className="text-gray-600">What values define your brand?</p>
              </div>

              {/* Brand Values Selection */}
              <div className="space-y-4">
                <Label htmlFor="brand-values" className="text-sm font-medium text-gray-900">Select Your Brand Values (Choose 3-5)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {brandValueOptions.map((value) => (
                    <button
                      key={value}
                      onClick={() => toggleBrandValue(value)}
                      disabled={!brandValues.includes(value) && brandValues.length >= 5}
                      className={`p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                        brandValues.includes(value)
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      }`}
                    >
                      <span className="font-medium">{value}</span>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 text-center">
                  {brandValues.length}/5 selected (minimum 3 required)
                </p>
              </div>
            </>
          )}
          {currentStep === 4 && (
            <>
              {/* Icon and Title */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                  <Lightbulb className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Style & Vision</h2>
                <p className="text-gray-600">Describe your ideal brand style</p>
              </div>

              {/* Upload Logo */}
              <div className="space-y-2">
                <Label htmlFor="logo-upload" className="text-sm font-medium text-gray-900">Upload Logo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="logo-upload" />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <Download className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">{uploadedLogo ? uploadedLogo.name : "Click to upload your logo"}</p>
                  </label>
                </div>
              </div>

              {/* Preferred Style */}
              <div className="space-y-4">
                <Label htmlFor="preferred-style" className="text-sm font-medium text-gray-900">Preferred Style *</Label>
                <div className="space-y-3">
                  {styleOptions.map((style) => (
                    <button
                      key={style}
                      onClick={() => setPreferredStyle(style)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                        preferredStyle === style
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">{style}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="additional-notes" className="text-sm font-medium text-gray-900">
                  Additional Notes or Inspiration
                </Label>
                <textarea
                  id="additional-notes"
                  placeholder="Any specific colors, fonts, or brands you admire? What should your brand feel like?"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={4}
                  className="w-full p-4 text-base border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 focus:outline-none resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12">
          <div>
            {currentStep > 1 && (
              <Button
                onClick={handlePrevious}
                variant="ghost"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-0 font-medium"
              >
                Previous
              </Button>
            )}
          </div>
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && (!companyName.trim() || !selectedIndustry)) ||
              (currentStep === 2 && !targetAudience.trim()) ||
              (currentStep === 3 && brandValues.length < 3) ||
              (currentStep === 4 && !preferredStyle)
            }
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 4 ? "Start Creating" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {isLoading && (
        <Loader />
      )}
    </div>
  )
}
