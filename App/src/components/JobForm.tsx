"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate, NavLink } from "react-router"
import { createJob } from "../services/api"
import { ArrowLeft, Loader2 } from "lucide-react"

interface JobFormData {
  name: string
  cronExpression: string
  description?: string
}

interface FormErrors {
  name?: string
  cronExpression?: string
  general?: string
}

const JobForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<JobFormData>({
    name: "",
    cronExpression: "",
    description: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const validateCronExpression = (cron: string): boolean => {
    // Basic cron validation regex (5 or 6 fields)
    const cronRegex =
      /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/[0-6])( (\*|([0-9]{4})|\*\/([0-9]{4})))?$/
    return cronRegex.test(cron.trim())
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Job name is required"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Job name must be at least 3 characters long"
    }

    if (!formData.cronExpression.trim()) {
      newErrors.cronExpression = "Cron expression is required"
    } else if (!validateCronExpression(formData.cronExpression)) {
      newErrors.cronExpression = "Invalid cron expression format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await createJob({
        name: formData.name.trim(),
        cronExpression: formData.cronExpression.trim(),
        description: formData.description?.trim() || undefined,
      })

      navigate("/", {
        state: { message: "Job created successfully!" },
      })
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "Failed to create job",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if ((field==="name" || field==="cronExpression") &&errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const cronExamples = [
    { expression: "0 9 * * *", description: "Daily at 9:00 AM" },
    { expression: "0 9 * * 1-5", description: "Weekdays at 9:00 AM" },
    { expression: "*/15 * * * *", description: "Every 15 minutes" },
    { expression: "0 0 1 * *", description: "First day of every month" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <NavLink to="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </NavLink>
      </div>

      <div className="card max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Job</h1>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Job Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`input-field ${errors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}`}
              placeholder="Enter job name"
              disabled={loading}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="cronExpression" className="block text-sm font-medium text-gray-700 mb-2">
              Cron Expression *
            </label>
            <input
              type="text"
              id="cronExpression"
              value={formData.cronExpression}
              onChange={(e) => handleInputChange("cronExpression", e.target.value)}
              className={`input-field font-mono ${errors.cronExpression ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}`}
              placeholder="0 9 * * *"
              disabled={loading}
            />
            {errors.cronExpression && <p className="mt-1 text-sm text-red-600">{errors.cronExpression}</p>}

            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Common examples:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {cronExamples.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleInputChange("cronExpression", example.expression)}
                    className="text-left p-2 bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                    disabled={loading}
                  >
                    <code className="text-xs text-primary">{example.expression}</code>
                    <p className="text-xs text-gray-600 mt-1">{example.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="Enter job description"
              disabled={loading}
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {loading ? "Creating..." : "Create Job"}
            </button>

            <NavLink to="/" className="btn-outline">
              Cancel
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JobForm
