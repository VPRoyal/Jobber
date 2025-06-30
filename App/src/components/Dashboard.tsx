"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useJobs } from "../hooks/useJobs"
import { Search, ChevronLeft, ChevronRight, Clock, Calendar, Loader2, Plus } from "lucide-react"

const Dashboard = () => {
  const { jobs, loading, error, fetchJobs } = useJobs()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 10

  useEffect(() => {
    fetchJobs(currentPage, { search: searchTerm })
  }, [currentPage, searchTerm, fetchJobs])

  const filteredJobs = jobs.filter((job) => job.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage)

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
          <p className="text-lg font-medium">Error loading jobs</p>
          <p className="text-sm mt-2">{error}</p>
          <button onClick={() => fetchJobs(currentPage)} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Job Dashboard</h1>
        <Link to="/create" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create New Job
        </Link>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Jobs Grid */}
      {currentJobs.length === 0 ? (
        <div className="card text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? "No jobs match your search criteria." : "Get started by creating your first job."}
          </p>
          <Link to="/create" className="btn-primary">
            Create Your First Job
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentJobs.map((job) => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="card hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{job.name}</h3>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {job.status}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Last run: {job.lastRunAt ? formatDate(job.lastRunAt) : "Never"}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Next run: {job.nextRunAt ? formatDate(job.nextRunAt) : "Not scheduled"}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{job.cronExpression}</code>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + jobsPerPage, filteredJobs.length)} of{" "}
            {filteredJobs.length} jobs
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <span className="px-3 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
