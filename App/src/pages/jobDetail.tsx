"use client"

import { useState, useEffect } from "react"
import { useParams, NavLink, useNavigate } from "react-router"
import { ArrowLeft, Calendar, Clock, Settings, Play, Pause, Trash2, Edit, Copy, ExternalLink } from "lucide-react"
import { getJobById } from "@/services/api"
import { useToast } from "@/hooks/useToast"
import LoadingSpinner from "@/components/common/loadingSpinner"
import StatusBadge from "@/components/common/statusBadge"
import type { Job } from "@/types"

const JobDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)
        const jobData = await getJobById(id)
        setJob(jobData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch job details")
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast(`${label} copied to clipboard`, "success")
    } catch (err) {
      showToast("Failed to copy to clipboard", "error")
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  if (error) {
    return (
      <div className="card max-w-md mx-auto text-center">
        <div className="text-red-500 mb-4">
          <Calendar className="h-12 w-12 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Error loading job</h3>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="btn-outline">
            Go Back
          </button>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    )
  }
  console.log("Job data:", job)
  if (!job) {
    return (
      <div className="card max-w-md mx-auto text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Job not found</h3>
        <p className="text-gray-600 mt-2">The job you're looking for doesn't exist.</p>
        <NavLink to="/" className="btn-primary mt-4">
          Back to Dashboard
        </NavLink>
      </div>
    )
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
        <span className="text-gray-900 font-medium">Job Details</span>
      </div>

      {/* Header */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.name}</h1>
                <div className="flex items-center gap-3">
                  <StatusBadge status={job.status} />
                  <button
                    onClick={() => copyToClipboard(job.id, "Job ID")}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <span className="font-mono">ID: {job.id.slice(0, 8)}...</span>
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {job.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{job.description}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary btn-sm">
              <Play className="h-4 w-4 mr-2" />
              Run Now
            </button>
            <button className="btn-outline btn-sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button className="btn-outline btn-sm">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </button>
            <button className="btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Schedule Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-gray-400" />
            Schedule Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Cron Expression</label>
              <div className="mt-1 flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-3 py-2 rounded-lg font-mono text-sm">{job.cronExpression}</code>
                <button
                  onClick={() => copyToClipboard(job.cronExpression, "Cron expression")}
                  className="btn-ghost btn-sm p-2"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Last Run
                </label>
                <p className="mt-1 text-sm text-gray-600">{job.lastRunAt ? formatDate(job.lastRunAt) : "Never"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Next Run
                </label>
                <p className="mt-1 text-sm text-gray-600">
                  {job.nextRunAt ? formatDate(job.nextRunAt) : "Not scheduled"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Metadata */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-400" />
            Job Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Job ID</label>
              <div className="mt-1 flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-3 py-2 rounded-lg font-mono text-sm break-all">{job.id}</code>
                <button onClick={() => copyToClipboard(job.id, "Job ID")} className="btn-ghost btn-sm p-2">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Created</label>
                <p className="mt-1 text-sm text-gray-600">{formatDate(job.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Updated</label>
                <p className="mt-1 text-sm text-gray-600">{formatDate(job.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Execution History */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-400" />
            Execution History
          </h3>
          <button className="btn-outline btn-sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Logs
          </button>
        </div>

        <div className="text-center py-8 text-gray-500">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No execution history available</p>
          <p className="text-sm mt-1">Job executions will appear here once the job runs</p>
        </div>
      </div>
    </div>
  )
}

export default JobDetail
