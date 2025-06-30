"use client"

import { useState, useEffect } from "react"
import { useParams, NavLink, useNavigate } from "react-router"
import { getJobById } from "../services/api"
import { ArrowLeft, Calendar, Clock, Settings, Loader2 } from "lucide-react"

interface Job {
  id: string
  name: string
  cronExpression: string
  status: string
  lastRunAt?: string
  nextRunAt?: string
  createdAt: string
  updatedAt: string
  description?: string
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return

      try {
        setLoading(true)
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
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Error loading job details</p>
          <p className="text-sm mt-2">{error}</p>
          <div className="mt-4 space-x-4">
            <button onClick={() => navigate(-1)} className="btn-outline">
              Go Back
            </button>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="card">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">Job not found</p>
          <p className="text-sm text-gray-600 mt-2">The job you're looking for doesn't exist.</p>
          <NavLink to="/" className="btn-primary mt-4">
            Back to Dashboard
          </NavLink>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <NavLink to="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </NavLink>
      </div>

      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.name}</h1>
            <div
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                job.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {job.status}
            </div>
          </div>
          <Settings className="h-6 w-6 text-gray-400" />
        </div>

        {job.description && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{job.description}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Schedule Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Settings className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Cron Expression</p>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{job.cronExpression}</code>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Run</p>
                    <p className="text-sm text-gray-600">{job.lastRunAt ? formatDate(job.lastRunAt) : "Never"}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Next Run</p>
                    <p className="text-sm text-gray-600">
                      {job.nextRunAt ? formatDate(job.nextRunAt) : "Not scheduled"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Job Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Job ID</p>
                  <p className="text-sm text-gray-600 font-mono">{job.id}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">Created At</p>
                  <p className="text-sm text-gray-600">{formatDate(job.createdAt)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">Updated At</p>
                  <p className="text-sm text-gray-600">{formatDate(job.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex space-x-4">
          <button className="btn-primary">Edit Job</button>
          <button className="btn-outline">Run Now</button>
          <button className="btn-outline text-red-600 border-red-300 hover:bg-red-50">Delete Job</button>
        </div>
      </div>
    </div>
  )
}

export default JobDetail
