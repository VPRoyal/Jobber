"use client"

import { useState, useEffect, useMemo } from "react"
import { NavLink } from "react-router"
import { Search, Plus, Filter, RefreshCw, Calendar, Clock, Play, Pause } from "lucide-react"
import { useJobs } from "@/hooks/useJobs"
import { useToast } from "@/hooks/useToast"
import LoadingSpinner from "@/components/common/loadingSpinner"
import JobCard from "@/components/jobs/JobCard"
import Pagination from "@/components/common/pagination"
import EmptyState from "@/components/common/emptyState"

const Dashboard = () => {
  const { jobs, loading, error, fetchJobs, refreshJobs } = useJobs()
  const { showToast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<"name" | "created" | "lastRun">("created")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const itemsPerPage = 12

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || job.status === statusFilter
      return matchesSearch && matchesStatus
    })

    // Sort jobs
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "created":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case "lastRun":
          const aTime = a.lastRunAt ? new Date(a.lastRunAt).getTime() : 0
          const bTime = b.lastRunAt ? new Date(b.lastRunAt).getTime() : 0
          comparison = aTime - bTime
          break
      }

      return sortOrder === "desc" ? -comparison : comparison
    })

    return filtered
  }, [jobs, searchTerm, statusFilter, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentJobs = filteredAndSortedJobs.slice(startIndex, startIndex + itemsPerPage)

  const handleRefresh = async () => {
    try {
      await refreshJobs()
      showToast("Jobs refreshed successfully", "success")
    } catch (error) {
      showToast("Failed to refresh jobs", "error")
    }
  }

  const stats = useMemo(() => {
    const total = jobs.length
    const active = jobs.filter((job) => job.status === "active").length
    const inactive = jobs.filter((job) => job.status === "inactive").length
    const paused = jobs.filter((job) => job.status === "paused").length

    return { total, active, inactive, paused }
  }, [jobs])

  if (loading && jobs.length === 0) {
    return <LoadingSpinner size="lg" />
  }

  if (error && jobs.length === 0) {
    return (
      <div className="card max-w-md mx-auto text-center">
        <div className="text-red-500 mb-4">
          <Calendar className="h-12 w-12 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Failed to load jobs</h3>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
        </div>
        <button onClick={handleRefresh} className="btn-primary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 text-balance">Job Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your scheduled jobs</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleRefresh} disabled={loading} className="btn-outline btn-sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <NavLink to="/create" className="btn-primary btn-md">
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </NavLink>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <Play className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paused</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.paused}</p>
            </div>
            <Pause className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
            </div>
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-full lg:w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input w-full lg:w-auto"
            >
              <option value="created">Created Date</option>
              <option value="name">Name</option>
              <option value="lastRun">Last Run</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="btn-outline btn-sm px-3"
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {currentJobs.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={searchTerm || statusFilter !== "all" ? "No jobs found" : "No jobs yet"}
          description={
            searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first scheduled job"
          }
          action={
            <NavLink to="/create" className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Job
            </NavLink>
          }
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredAndSortedJobs.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard
