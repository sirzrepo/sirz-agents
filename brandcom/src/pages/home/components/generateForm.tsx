"use client"

import type React from "react"
import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Globe, Building2, FileText, Monitor, CheckCircle } from "lucide-react"
import Button from "../../../components/common/ui/Button"
import Label from "../../../components/common/ui/Label"
import Input from "../../../components/common/ui/Input"
import TextArea from "../../../components/common/textarea"
import { BASE_URL } from "../../../utils"
import PreviewAssets from "./previewAssets"
import NotificationModal from "@/components/layout/notificationModal"
import { useDispatch } from "react-redux"
import { openNotificationModal } from "@/store/notificationModal"
import { GeneratedAssets, NotificationType } from "@/types"
import { FaArrowLeft } from "react-icons/fa"
import { addProjectInactive } from "@/store/addProjectSlice"
// const [status, setStatus] = useState("loading")

interface FormData {
  input0: string // Describe your business
  input1: string // Domain name
  input2: string // Business name
  input3: string // Describe your website
}

export default function BrandAssetsForm() {
  const [formData, setFormData] = useState<FormData>({
    input0: "",
    input1: "",
    input2: "",
    input3: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [assets, setAssets] = useState<GeneratedAssets | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState("loading")
  const dispatch = useDispatch()

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setAssets(null)

    dispatch(openNotificationModal("notification"))

    for (let [key, value] of Object.entries(formData)) {
        console.log(`${key}:`, value);
      }

    try {
      const response = await fetch(`${BASE_URL}/api/generate-assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to generate brand assets")
      }

      const generatedAssets = await response.json()
      setAssets(generatedAssets)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setStatus("error")

    dispatch(openNotificationModal("notification"))
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.input0 && formData.input1 && formData.input2 && formData.input3

  if (assets) {
    return <PreviewAssets assets={assets} onBack={() => setAssets(null)} />
  }

  return (
    <div className=" sm:w-[80%] mx-auto pb-6">
      <button 
        onClick={() => dispatch(addProjectInactive())}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
      >
        <FaArrowLeft className="mr-2" /> Back to Assets
      </button>
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Brand Assets Generator</h1>
        <p className="text-slate-600">Create your complete brand identity with AI-powered generation</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <section className="border-slate-200 shadow-lg">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b py-5 px-6 border-slate-200">
              <h2 className="text-slate-800 font-bold text-[25px]">Tell us about your business</h2>
              <p className="text-slate-600">
                Provide details about your business to generate custom brand assets
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Info Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5" style={{ color: "#7e22ce" }} />
                    <h3 className="text-lg font-semibold text-slate-800">Business Information</h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="business-name" className="text-slate-700 font-medium">
                        Business Name *
                      </Label>
                      <Input
                        id="business-name"
                        placeholder="e.g., Acme Corporation"
                        value={formData.input2}
                        onChange={(e) => handleInputChange("input2", e.target.value)}
                        className="border-slate-300 focus:ring-2 py-4"
                        style={{ "--tw-ring-color": "#7e22ce" } as React.CSSProperties}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="domain-name" className="text-slate-700 font-medium">
                        Domain Name *
                      </Label>
                      <Input
                        id="domain-name"
                        placeholder="e.g., acmecorp.com"
                        value={formData.input1}
                        onChange={(e) => handleInputChange("input1", e.target.value)}
                        className="border-slate-300 focus:ring-2 py-4"
                        style={{ "--tw-ring-color": "#7e22ce" } as React.CSSProperties}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Business Description Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 py-4">
                    <FileText className="h-5 w-5" style={{ color: "#7e22ce" }} />
                    <h3 className="text-lg font-semibold text-slate-800">Business Description</h3>
                  </div>

                  <div className="space-y-2">
                    <TextArea
                      name="business-description"
                      title="Describe Your Business *"
                      placeholder="Tell us what your business does, your target audience, key services, and what makes you unique..."
                      value={formData.input0}
                      onChange={(e) => handleInputChange("input0", e.target.value)}
                    //   required
                    />
                    <p className="text-sm text-slate-500">
                      Be specific about your industry, target market, and unique value proposition.
                    </p>
                  </div>
                </div>

                {/* Website Description Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Monitor className="h-5 w-5" style={{ color: "#7e22ce" }} />
                    <h3 className="text-lg font-semibold text-slate-800">Website Vision</h3>
                  </div>

                  <div className="space-y-2">
                    <TextArea
                      name="website-description"
                      title="Describe Your Ideal Website *"
                      placeholder="Describe the type of website you want, its purpose, style preferences, key features, and overall look and feel..."
                      value={formData.input3}
                      onChange={(e) => handleInputChange("input3", e.target.value)}
                      required
                    />
                    <p className="text-sm text-slate-500">
                      Include details about design style, functionality, and user experience preferences.
                    </p>
                  </div>
                </div>

                {error && (
                  <div>
                    <span className="text-red-500">{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full text-white hover:opacity-90"
                  style={{ backgroundColor: "#7e22ce" }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Brand Assets...
                    </>
                  ) : (
                    <>
                      Generate Brand Assets
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </section>
        </div>

        {/* Review Section */}
        <div className="lg:col-span-1">
          <section className="border-slate-200 shadow-lg sticky top-6">
            <div className="bg-gradient-to-r py-5 px-6 from-purple-50 to-violet-50 border-b border-slate-200">
              <h2 className="flex text-[23px] font-bold items-center gap-2 text-slate-800">
                <CheckCircle className="h-5 w-5" style={{ color: "#7e22ce" }} />
                Review Your Information
              </h2>
              <p className="text-slate-600">Preview of your brand details</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700 flex items-center gap-2">
                    <Building2 className="h-4 w-4" style={{ color: "#7e22ce" }} />
                    Business Name
                  </h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg min-h-[2.5rem] flex items-center">
                    {formData.input2 || "Enter your business name..."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700 flex items-center gap-2">
                    <Globe className="h-4 w-4" style={{ color: "#7e22ce" }} />
                    Domain
                  </h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg min-h-[2.5rem] flex items-center">
                    {formData.input1 || "Enter your domain name..."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700 flex items-center gap-2">
                    <FileText className="h-4 w-4" style={{ color: "#7e22ce" }} />
                    Business Description
                  </h4>
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg min-h-[4rem]">
                    {formData.input0 || "Describe your business..."}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700 flex items-center gap-2">
                    <Monitor className="h-4 w-4" style={{ color: "#7e22ce" }} />
                    Website Vision
                  </h4>
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg min-h-[4rem]">
                    {formData.input3 || "Describe your ideal website..."}
                  </div>
                </div>

                {isFormValid && (
                  <div className="mt-6 p-4 rounded-lg border-2 border-dashed" style={{ borderColor: "#7e22ce" }}>
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2" style={{ color: "#7e22ce" }} />
                      <p className="text-sm font-medium" style={{ color: "#7e22ce" }}>
                        Ready to Generate!
                      </p>
                      <p className="text-xs text-slate-500 mt-1">All fields completed</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      <NotificationModal
          type={status as NotificationType || "loading"}
          message="Please wait while we generate your brand assets..."
          id="notification"
      />
    </div>
  )
}
