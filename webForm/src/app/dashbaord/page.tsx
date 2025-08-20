"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Globe, Palette, Settings, PoundSterling, Sparkles, Zap, Rocket } from "lucide-react"
import { BASE_URL } from "@/lib/utils"
import axios from "axios"
import Loader from "@/features/loader"


interface FormData {
  // Business & Brand
  businessName: string
  industry: string
  businessDescription: string
  brandStyle: string
  hasLogo: string
  brandColors: string

  // Website Type
  websiteType: string[]

  // Features & Integrations
  features: string[]

  // Conditional fields
  productCount: string
  paymentGateways: string[]
  bookingType: string
  calendarIntegration: string

  // Content & Maintenance
  contentProvider: string
  needCopywriting: string
  maintenancePreference: string

  // Budget & Timeline
  budget: string
  timeline: string
  launchDate: string
  additionalRequirements: string
}

const initialFormData: FormData = {
  businessName: "",
  industry: "",
  businessDescription: "",
  brandStyle: "",
  hasLogo: "",
  brandColors: "",
  websiteType: [],
  features: [],
  productCount: "",
  paymentGateways: [],
  bookingType: "",
  calendarIntegration: "",
  contentProvider: "",
  needCopywriting: "",
  maintenancePreference: "",
  budget: "",
  timeline: "",
  launchDate: "",
  additionalRequirements: "",
}

export default function ClientQuestionnaire() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(false)

  const [currentSection, setCurrentSection] = useState(0)

  const sections = [
    { id: "business", title: "Business & Brand", icon: Globe },
    { id: "website", title: "Website Type", icon: Palette },
    { id: "features", title: "Features & Integrations", icon: Settings },
    { id: "content", title: "Content & Maintenance", icon: CheckCircle },
    { id: "budget", title: "Budget & Timeline", icon: PoundSterling },
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter((item) => item !== value),
    }))
  }

  const showEcommerceFields = formData.websiteType.includes("e-commerce")
  const showBookingFields = formData.websiteType.includes("booking")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      console.log("Form submitted:", formData)

      const { data } = await axios.post(
        `${BASE_URL}/api/web-form-questionnaire`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      console.log("Form submitted:", data)
      setSubmissionStatus("success")
    } catch (error: any) {
      console.error("Error submitting form:", error.response?.data || error.message)
      setSubmissionStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFormData(initialFormData)
    setCurrentSection(0)
    setSubmissionStatus("idle")
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {submissionStatus === "success" && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="gradient-border animate-float">
            <Card className="border-0 shadow-2xl py-8 text-center w-full max-w-md">
              <CardContent className="space-y-6">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-pulse" />
                <h2 className="text-3xl font-bold text-primary">Submission Successful!</h2>
                <p className="text-muted-foreground text-lg">
                  Thank you for your time. We have received your details and will be in touch shortly.
                </p>
                <Button onClick={handleReset} className="mt-6 w-full">
                  Submit Another Response
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
          </div>
          <h1 className="text-5xl font-bold text-primary mb-4 animate-glow">
            Sirz Client Questionnaire
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your insights help us create the perfect website for you
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="glass-effect rounded-full p-4 shadow-lg">
            <div className="flex space-x-3">
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <div key={section.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ${
                        index <= currentSection
                          ? "bg-gradient-to-r from-primary to-primary border-primary text-primary-foreground shadow-lg animate-glow"
                          : "border-border text-muted-foreground hover:border-accent/50"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    {index < sections.length - 1 && (
                      <div
                        className={`w-16 h-1 mx-3 rounded-full transition-all duration-500 ${
                          index < currentSection ? "bg-gradient-to-r from-primary to-accent shadow-sm" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {submissionStatus === "error" && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg text-center">
              <p>There was an error submitting your form. Please try again later.</p>
            </div>
          )}

          {currentSection === 0 && (
            <div className="gradient-border animate-float">
              <Card className="border-0 shadow-2xl py-8">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-primary rounded-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    Business & Brand Information
                  </CardTitle>
                  <CardDescription className="text-base">
                    Tell us about your business and brand identity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="businessName" className="text-sm font-semibold text-foreground">
                        Business Name *
                      </Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        placeholder="Enter your business name"
                        className="h-12 border-2 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/20"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="industry" className="text-sm font-semibold text-foreground">
                        Industry *
                      </Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                        <SelectTrigger className="h-12 border-2 focus:border-primary transition-all duration-300">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="hospitality">Hospitality</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="creative">Creative Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="businessDescription" className="text-sm font-semibold text-foreground">
                      Business Description *
                    </Label>
                    <Textarea
                      id="businessDescription"
                      value={formData.businessDescription}
                      onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                      placeholder="Describe your business, target audience, and key services/products"
                      rows={4}
                      className="border-2 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/20 resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="brandStyle" className="text-sm font-semibold text-foreground">
                      Preferred Brand Style
                    </Label>
                    <Select
                      value={formData.brandStyle}
                      onValueChange={(value) => handleInputChange("brandStyle", value)}
                    >
                      <SelectTrigger className="h-12 border-2 focus:border-primary transition-all duration-300">
                        <SelectValue placeholder="Select your preferred style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern & Minimalist</SelectItem>
                        <SelectItem value="professional">Professional & Corporate</SelectItem>
                        <SelectItem value="creative">Creative & Artistic</SelectItem>
                        <SelectItem value="playful">Playful & Fun</SelectItem>
                        <SelectItem value="luxury">Luxury & Premium</SelectItem>
                        <SelectItem value="rustic">Rustic & Natural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-foreground">Do you have an existing logo?</Label>
                    <RadioGroup value={formData.hasLogo} onValueChange={(value) => handleInputChange("hasLogo", value)}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="yes" id="logo-yes" />
                        <Label htmlFor="logo-yes" className="cursor-pointer">
                          Yes, I have a logo
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="no" id="logo-no" />
                        <Label htmlFor="logo-no" className="cursor-pointer">
                          No, I need logo design
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="redesign" id="logo-redesign" />
                        <Label htmlFor="logo-redesign" className="cursor-pointer">
                          I have one but want it redesigned
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="brandColors" className="text-sm font-semibold text-foreground">
                      Brand Colors (if any)
                    </Label>
                    <Input
                      id="brandColors"
                      value={formData.brandColors}
                      onChange={(e) => handleInputChange("brandColors", e.target.value)}
                      placeholder="e.g., Blue (#1E40AF), White, Gray"
                      className="h-12 border-2 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/20"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentSection === 1 && (
            <div className="gradient-border animate-float">
              <Card className="border-0 shadow-2xl py-8">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-primary rounded-lg">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    Website Type
                  </CardTitle>
                  <CardDescription className="text-base">
                    What type of website do you need? (Select all that apply)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: "informational", label: "Informational/Brochure", desc: "Basic company information" },
                      { id: "portfolio", label: "Portfolio/Gallery", desc: "Showcase work or products" },
                      { id: "blog", label: "Blog/News", desc: "Content publishing platform" },
                      { id: "e-commerce", label: "E-commerce", desc: "Online store with payments" },
                      { id: "booking", label: "Booking/Scheduling", desc: "Appointment or reservation system" },
                      { id: "corporate", label: "Corporate", desc: "Large business website" },
                      { id: "membership", label: "Membership/Community", desc: "User accounts and communities" },
                      { id: "custom", label: "Custom Web App", desc: "Specialized functionality" },
                    ].map((type) => (
                      <div key={type.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                        <Checkbox
                          id={type.id}
                          checked={formData.websiteType.includes(type.id)}
                          onCheckedChange={(checked) => handleArrayChange("websiteType", type.id, checked as boolean)}
                        />
                        <div className="space-y-1">
                          <Label htmlFor={type.id} className="font-medium">
                            {type.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">{type.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentSection === 2 && (
            <div className="gradient-border animate-float">
              <Card className="border-0 shadow-2xl py-8">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-primary rounded-lg">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    Features & Integrations
                  </CardTitle>
                  <CardDescription className="text-base">Select the features and integrations you need</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      "Contact Form",
                      "Newsletter Signup",
                      "Live Chat/Chatbot",
                      "Social Media Integration",
                      "SEO Optimization",
                      "Google Analytics",
                      "Customer Reviews",
                      "Multi-language Support",
                      "Search Functionality",
                      "User Accounts/Login",
                      "Payment Processing",
                      "Inventory Management",
                      "Email Marketing Integration",
                      "CRM Integration",
                      "API Integrations",
                      "Mobile App Integration",
                    ].map((feature) => (
                      <div key={feature} className="flex items-center space-x-3">
                        <Checkbox
                          id={feature}
                          checked={formData.features.includes(feature)}
                          onCheckedChange={(checked) => handleArrayChange("features", feature, checked as boolean)}
                        />
                        <Label htmlFor={feature}>{feature}</Label>
                      </div>
                    ))}
                  </div>

                  {/* Conditional E-commerce Fields */}
                  {showEcommerceFields && (
                    <>
                      <Separator />
                      <div className="space-y-6">
                        <h4 className="font-semibold text-accent mb-3">E-commerce Specific</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="productCount" className="text-sm font-semibold text-foreground">
                              Approximate Number of Products
                            </Label>
                            <Select
                              value={formData.productCount}
                              onValueChange={(value) => handleInputChange("productCount", value)}
                            >
                              <SelectTrigger className="h-12 border-2 focus:border-primary transition-all duration-300">
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1-10">1-10 products</SelectItem>
                                <SelectItem value="11-50">11-50 products</SelectItem>
                                <SelectItem value="51-200">51-200 products</SelectItem>
                                <SelectItem value="200+">200+ products</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-foreground">
                            Payment Gateways (Select all that apply)
                          </Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {["Stripe", "PayPal", "Square", "Apple Pay", "Google Pay", "Bank Transfer"].map(
                              (gateway) => (
                                <div key={gateway} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={gateway}
                                    checked={formData.paymentGateways.includes(gateway)}
                                    onCheckedChange={(checked) =>
                                      handleArrayChange("paymentGateways", gateway, checked as boolean)
                                    }
                                  />
                                  <Label htmlFor={gateway}>{gateway}</Label>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Conditional Booking Fields */}
                  {showBookingFields && (
                    <>
                      <Separator />
                      <div className="space-y-6">
                        <h4 className="font-semibold text-accent mb-3">Booking System Specific</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="bookingType" className="text-sm font-semibold text-foreground">
                              Type of Booking
                            </Label>
                            <Select
                              value={formData.bookingType}
                              onValueChange={(value) => handleInputChange("bookingType", value)}
                            >
                              <SelectTrigger className="h-12 border-2 focus:border-primary transition-all duration-300">
                                <SelectValue placeholder="Select booking type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="appointments">Appointments</SelectItem>
                                <SelectItem value="events">Events</SelectItem>
                                <SelectItem value="services">Services</SelectItem>
                                <SelectItem value="rentals">Equipment/Space Rentals</SelectItem>
                                <SelectItem value="classes">Classes/Workshops</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="calendarIntegration" className="text-sm font-semibold text-foreground">
                              Calendar Integration
                            </Label>
                            <Select
                              value={formData.calendarIntegration}
                              onValueChange={(value) => handleInputChange("calendarIntegration", value)}
                            >
                              <SelectTrigger className="h-12 border-2 focus:border-primary transition-all duration-300">
                                <SelectValue placeholder="Select calendar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="google">Google Calendar</SelectItem>
                                <SelectItem value="outlook">Outlook Calendar</SelectItem>
                                <SelectItem value="apple">Apple Calendar</SelectItem>
                                <SelectItem value="custom">Custom Calendar System</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {currentSection === 3 && (
            <div className="gradient-border animate-float">
              <Card className="border-0 shadow-2xl py-8">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-primary rounded-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    Content & Maintenance
                  </CardTitle>
                  <CardDescription className="text-base">
                    Let us know about content creation and ongoing maintenance needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <Label className="text-sm font-semibold text-foreground">
                      Who will provide the website content (text, images, videos)?
                    </Label>
                    <RadioGroup
                      value={formData.contentProvider}
                      onValueChange={(value) => handleInputChange("contentProvider", value)}
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="client" id="content-client" />
                        <Label htmlFor="content-client" className="cursor-pointer">
                          I will provide all content
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="mixed" id="content-mixed" />
                        <Label htmlFor="content-mixed" className="cursor-pointer">
                          I&apos;ll provide some, you help with the rest
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="agency" id="content-agency" />
                        <Label htmlFor="content-agency" className="cursor-pointer">
                          Please create all content for me
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-sm font-semibold text-foreground">
                      Do you need professional copywriting services?
                    </Label>
                    <RadioGroup
                      value={formData.needCopywriting}
                      onValueChange={(value) => handleInputChange("needCopywriting", value)}
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="yes" id="copy-yes" />
                        <Label htmlFor="copy-yes" className="cursor-pointer">
                          Yes, I need professional copywriting
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="no" id="copy-no" />
                        <Label htmlFor="copy-no" className="cursor-pointer">
                          No, I&apos;ll handle the writing myself
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="review" id="copy-review" />
                        <Label htmlFor="copy-review" className="cursor-pointer">
                          I&apos;ll write it, but would like it reviewed/edited
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-sm font-semibold text-foreground">Ongoing maintenance preference</Label>
                    <RadioGroup
                      value={formData.maintenancePreference}
                      onValueChange={(value) => handleInputChange("maintenancePreference", value)}
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="self" id="maintenance-self" />
                        <Label htmlFor="maintenance-self" className="cursor-pointer">
                          I&apos;ll handle updates myself
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="monthly" id="maintenance-monthly" />
                        <Label htmlFor="maintenance-monthly" className="cursor-pointer">
                          Monthly maintenance package
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="asneeded" id="maintenance-asneeded" />
                        <Label htmlFor="maintenance-asneeded" className="cursor-pointer">
                          As-needed support
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="training" id="maintenance-training" />
                        <Label htmlFor="maintenance-training" className="cursor-pointer">
                          Training to manage it myself
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentSection === 4 && (
            <div className="gradient-border animate-float">
              <Card className="border-0 shadow-2xl py-8">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-primary rounded-lg">
                      <PoundSterling className="w-6 h-6 text-white" />
                    </div>
                    Budget & Timeline
                  </CardTitle>
                  <CardDescription className="text-base">
                    Help us understand your budget and timeline expectations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="budget" className="text-sm font-semibold text-foreground">
                      Project Budget (GBP)
                    </Label>
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                      <SelectTrigger className="h-12 border-2 focus:border-primary transition-all duration-300">
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-1k">Under £1,000</SelectItem>
                        <SelectItem value="1k-3k">£1,000 - £3,000</SelectItem>
                        <SelectItem value="3k-5k">£3,000 - £5,000</SelectItem>
                        <SelectItem value="5k-10k">£5,000 - £10,000</SelectItem>
                        <SelectItem value="10k-20k">£10,000 - £20,000</SelectItem>
                        <SelectItem value="20k-50k">£20,000 - £50,000</SelectItem>
                        <SelectItem value="over-50k">Over £50,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="timeline" className="text-sm font-semibold text-foreground">
                      Desired Timeline
                    </Label>
                    <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                      <SelectTrigger className="h-12 border-2 focus:border-primary transition-all duration-300">
                        <SelectValue placeholder="Select your preferred timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP (Rush job)</SelectItem>
                        <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                        <SelectItem value="3-4weeks">3-4 weeks</SelectItem>
                        <SelectItem value="1-2months">1-2 months</SelectItem>
                        <SelectItem value="2-3months">2-3 months</SelectItem>
                        <SelectItem value="3-6months">3-6 months</SelectItem>
                        <SelectItem value="flexible">I&apos;m flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="launchDate" className="text-sm font-semibold text-foreground">
                      Preferred Launch Date (if specific)
                    </Label>
                    <Input
                      id="launchDate"
                      type="date"
                      value={formData.launchDate}
                      onChange={(e) => handleInputChange("launchDate", e.target.value)}
                      className="h-12 border-2 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="additionalRequirements" className="text-sm font-semibold text-foreground">
                      Additional Requirements or Comments
                    </Label>
                    <Textarea
                      id="additionalRequirements"
                      value={formData.additionalRequirements}
                      onChange={(e) => handleInputChange("additionalRequirements", e.target.value)}
                      placeholder="Any specific requirements, concerns, or additional information you'd like to share..."
                      rows={4}
                      className="border-2 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/20 resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-between items-center pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className="h-12 px-8 border-2 hover:border-primary transition-all duration-300 disabled:opacity-50"
            >
              Previous
            </Button>

            <div className="flex items-center space-x-3">
              {sections.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSection
                      ? "bg-primary shadow-lg shadow-primary/50 scale-125"
                      : index < currentSection
                        ? "bg-accent shadow-md shadow-accent/30"
                        : "bg-border hover:bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            {currentSection < sections.length - 1 ? (
              <Button
                type="button"
                onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                className="h-12 px-8 bg-primary hover:from-accent hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/30"
              >
                Next
              </Button>
            ) : (
              <form onSubmit={handleSubmit}>
                <Button
                  type="submit"
                  className="h-12 px-8 bg-primary hover:from-accent hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/30 animate-glow w-full"
                >
                  Submit Questionnaire
                </Button>
              </form>
            )}
          </div>
        </div>

        {(formData.websiteType.length > 0 || formData.features.length > 0) && (
          <div className="mt-12 glass-effect rounded-2xl p-6 shadow-2xl">
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Your Selection Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {formData.websiteType.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Website Types:</h4>
                      <div className="flex flex-wrap gap-3">
                        {formData.websiteType.map((type) => (
                          <Badge
                            key={type}
                            variant="secondary"
                            className="px-4 py-2 text-sm bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Selected Features:</h4>
                      <div className="flex flex-wrap gap-3">
                        {formData.features.map((feature) => (
                          <Badge
                            key={feature}
                            variant="outline"
                            className="px-4 py-2 text-sm border-accent/30 hover:border-accent hover:bg-accent/10 transition-all duration-300"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {isLoading && 
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          loading...
        </div>
        }
      </div>
    </div>
  )
}
