"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate, NavLink } from "react-router"
import { ArrowLeft, Plus, Clock, Info } from "lucide-react"
import { createJob } from "../services/api"
import { useToast } from "../hooks/useToast"
import LoadingSpinner from "@/components/common/loadingSpinner"
import type { JobTypes } from "@/types"
import { getAvailableServices } from "../services/api"

interface JobFormData {
  name: string
  cronExpression: string
  description: string
  type: string
}

interface FormErrors {
  name?: string
  cronExpression?: string
  general?: string
  type?: string
}

const CreateJob = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [formData, setFormData] = useState<JobFormData>({
    name: "",
    cronExpression: "",
    description: "",
    type: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [loadingJobTypes, setLoadingJobTypes] = useState(true)
  const [availableJobTypes, setAvailableJobTypes] = useState<JobTypes[]>([])

  const cronExamples = [
    { expression: "0 9 * * *", description: "Daily at 9:00 AM", icon: "🌅" },
    { expression: "0 9 * * 1-5", description: "Weekdays at 9:00 AM", icon: "💼" },
    { expression: "*/15 * * * *", description: "Every 15 minutes", icon: "⏰" },
    { expression: "0 0 1 * *", description: "First day of every month", icon: "📅" },
    { expression: "0 */2 * * *", description: "Every 2 hours", icon: "🕐" },
    { expression: "0 0 * * 0", description: "Every Sunday at midnight", icon: "🌙" },
  ]

  // Fetch available job types on component mount

  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        setLoadingJobTypes(true)
        const types = await getAvailableServices()
        setAvailableJobTypes(types)
      } catch (err) {
        showToast("Failed to load available job types", "error")
        console.error("Error fetching job types:", err)
      } finally {
        setLoadingJobTypes(false)
      }
    }

    fetchJobTypes()
  }, [showToast])

  const validateCronExpression = (cron: string): boolean => {
    // Enhanced cron validation regex
    const cronRegex =
      /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/[0-6])$/
    return cronRegex.test(cron.trim())
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Job name is required"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Job name must be at least 3 characters"
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Job name must be less than 100 characters"
    }

    // Job type validation
    if (!formData.type) {
      newErrors.type = "Job type is required"
    }

    // Cron expression validation
    if (!formData.cronExpression.trim()) {
      newErrors.cronExpression = "Cron expression is required"
    } else if (!validateCronExpression(formData.cronExpression)) {
      newErrors.cronExpression = "Invalid cron expression format (use 5 fields: minute hour day month weekday)"
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
      const newJob = await createJob({
        name: formData.name.trim(),
        cronExpression: formData.cronExpression.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
      })

      showToast("Job created successfully!", "success")
      navigate(`/jobs/${newJob.id}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create job"
      setErrors({ general: errorMessage })
      showToast(errorMessage, "error")
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

  const handleCronSelect = (expression: string) => {
    handleInputChange("cronExpression", expression)
  }

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <NavLink to="/" className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Dashboard
        </NavLink>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium">Create Job</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
        <p className="text-gray-600 mt-2">Set up a new scheduled job with custom timing and configuration</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-red-700 text-sm font-medium">{errors.general}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`input ${errors.name ? "input-error" : ""} px-1.5`}
                  placeholder="e.g., Daily Report Generation"
                  disabled={loading}
                  maxLength={100}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                <p className="mt-1 text-xs text-gray-500">{formData.name.length}/100 characters</p>
              </div>

              {/* Job Type Selection */}
              <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                {loadingJobTypes ? (
                  <div className="input flex items-center justify-center py-3">
                    <div className="loading-spinner h-4 w-4 mr-2" />
                    <span className="text-gray-500">Loading job types...</span>
                  </div>
                ) : (
                  <select
                    id="jobType"
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className={`input ${errors.type ? "input-error" : ""}`}
                    disabled={loading || availableJobTypes.length === 0}
                  >
                    <option value="">Select a job type</option>
                    {availableJobTypes.map((jobType) => (
                      <option key={jobType.type} value={jobType.type}>
                        {jobType.label}
                      </option>
                    ))}
                  </select>
                )}
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                {!loadingJobTypes && availableJobTypes.length === 0 && (
                  <p className="mt-1 text-sm text-yellow-600">
                    No Jobs available. Please contact your administrator.
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Choose the type of job you want to schedule</p>
              </div>

              {/* Cron Expression */}
              <div>
                <label htmlFor="cronExpression" className="block text-sm font-medium text-gray-700 mb-2">
                  Cron Expression *
                </label>
                <input
                  type="text"
                  id="cronExpression"
                  value={formData.cronExpression}
                  onChange={(e) => handleInputChange("cronExpression", e.target.value)}
                  className={`input font-mono ${errors.cronExpression ? "input-error" : ""} px-1.5`}
                  placeholder="0 9 * * *"
                  disabled={loading}
                />
                {errors.cronExpression && <p className="mt-1 text-sm text-red-600">{errors.cronExpression}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  Format: minute hour day month weekday (e.g., "0 9 * * *" for daily at 9 AM)
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className="input resize-none px-1.5"
                  placeholder="Describe what this job does..."
                  disabled={loading}
                  maxLength={500}
                />
                <p className="mt-1 text-xs text-gray-500">{formData.description.length}/500 characters</p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button type="submit" disabled={loading} className="btn-primary btn-sm cursor-pointer shadow-accent-foreground border-1 py-1 px-2 rounded-lg">
                  {(loading && <div className="loading-spinner h-4 w-4 mr-2" >Creating...</div>) || <div className="flex items-center justify-items-center"><Plus className="h-4 w-4 mr-2" /> <span>Create Job</span> </div>}
                      
                      
                </button>
                <NavLink to="/" className="btn-outline btn-md cursor-pointer shadow-accent-foreground border-1 py-1 px-2 rounded-lg">
                  Cancel
                </NavLink>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cron Examples */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-400" />
              Common Patterns
            </h3>
            <div className="space-y-2">
              {cronExamples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleCronSelect(example.expression)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors group"
                  disabled={loading}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{example.icon}</span>
                    <div className="flex-1 min-w-0">
                      <code className="text-sm text-primary-600 font-mono block">{example.expression}</code>
                      <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-700">{example.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Help */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Cron Format Help
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <span>* * * * *</span>
                <span className="text-blue-600">Format</span>
                <span>0-59</span>
                <span>Minute</span>
                <span>0-23</span>
                <span>Hour</span>
                <span>1-31</span>
                <span>Day</span>
                <span>1-12</span>
                <span>Month</span>
                <span>0-6</span>
                <span>Weekday</span>
              </div>
              <div className="pt-2 border-t border-blue-200">
                <p className="text-xs">
                  Use <code>*</code> for any value, <code>/</code> for intervals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateJob
