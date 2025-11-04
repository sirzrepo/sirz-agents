"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

export default function UserDetails() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    middleNames: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    hasMiddleNames: "",
    experience: "",
    country: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="overflow-y-hidden bg-blue-700">
        <div>
            <h1>hello</h1>
        </div>
        <Card className="w-full max-w-2xl mx-auto bg-white shadow-2xl mt-10 ">
            <div className="p-8 md:p-10 ">
            {/* Header */}
            <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                About You
                <span className="text-xl">✏️</span>
            </h1>
            <p className="text-slate-600">Help us get to know you better by answering a few basic questions.</p>
            </div>

            {/* Info Box */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
            <span className="text-blue-600 font-semibold text-lg flex-shrink-0">ℹ️</span>
            <p className="text-sm text-blue-900">
                Why are we asking you this? We use this information to personalize your experience and ensure we provide the
                best service.
            </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
                <Label htmlFor="firstName" className="text-slate-900 font-semibold mb-2 block">
                First Name
                </Label>
                <Input
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                />
            </div>

            {/* Last Name */}
            <div>
                <Label htmlFor="lastName" className="text-slate-900 font-semibold mb-2 block">
                Last Name
                </Label>
                <Input
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                />
            </div>

            {/* Email */}
            <div>
                <Label htmlFor="email" className="text-slate-900 font-semibold mb-2 block">
                Email Address
                </Label>
                <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                />
            </div>

            {/* Middle Names Radio */}
            <div>
                <Label className="text-slate-900 font-semibold mb-3 block">Do you have any middle names?</Label>
                <RadioGroup
                value={formData.hasMiddleNames}
                onValueChange={(value) => handleSelectChange("hasMiddleNames", value)}
                >
                <div className="flex items-center space-x-2 p-3 border border-teal-300 rounded-lg mb-2 cursor-pointer hover:bg-teal-50">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="cursor-pointer flex-1 font-medium text-slate-900">
                    Yes
                    </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="cursor-pointer flex-1 font-medium text-slate-900">
                    No
                    </Label>
                </div>
                </RadioGroup>
            </div>

            {/* Middle Names Input - Conditional */}
            {formData.hasMiddleNames === "yes" && (
                <div>
                <Label htmlFor="middleNames" className="text-slate-900 font-semibold mb-2 block">
                    Middle Names
                </Label>
                <Input
                    id="middleNames"
                    name="middleNames"
                    placeholder="Enter your middle names"
                    value={formData.middleNames}
                    onChange={handleInputChange}
                    className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                />
                </div>
            )}

            {/* Date of Birth */}
            <div>
                <Label className="text-slate-900 font-semibold mb-3 block">Date of Birth</Label>
                <div className="grid grid-cols-3 gap-3">
                <Select value={formData.birthDay} onValueChange={(value) => handleSelectChange("birthDay", value)}>
                    <SelectTrigger className="border-slate-300 focus:border-teal-500 focus:ring-teal-500">
                    <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>

                <Select value={formData.birthMonth} onValueChange={(value) => handleSelectChange("birthMonth", value)}>
                    <SelectTrigger className="border-slate-300 focus:border-teal-500 focus:ring-teal-500">
                    <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                    {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                    ].map((month, i) => (
                        <SelectItem key={i} value={String(i + 1)}>
                        {month}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>

                <Select value={formData.birthYear} onValueChange={(value) => handleSelectChange("birthYear", value)}>
                    <SelectTrigger className="border-slate-300 focus:border-teal-500 focus:ring-teal-500">
                    <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                    {Array.from({ length: 100 }, (_, i) => {
                        const year = new Date().getFullYear() - i
                        return (
                        <SelectItem key={year} value={String(year)}>
                            {year}
                        </SelectItem>
                        )
                    })}
                    </SelectContent>
                </Select>
                </div>
            </div>

            {/* Experience Level */}
            <div>
                <Label htmlFor="experience" className="text-slate-900 font-semibold mb-2 block">
                Experience Level
                </Label>
                <Select value={formData.experience} onValueChange={(value) => handleSelectChange("experience", value)}>
                <SelectTrigger className="border-slate-300 focus:border-teal-500 focus:ring-teal-500">
                    <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Country */}
            <div>
                <Label htmlFor="country" className="text-slate-900 font-semibold mb-2 block">
                Country
                </Label>
                <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                <SelectTrigger className="border-slate-300 focus:border-teal-500 focus:ring-teal-500">
                    <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="jp">Japan</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <Button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                Continue
                </Button>
            </div>
            </form>
            </div>
        </Card>
    </div>
  )
}
