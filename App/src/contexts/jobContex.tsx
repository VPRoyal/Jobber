"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Job, JobFilters } from "../types"
import { getJobs, getJobById } from "../services/api"

interface JobContextType {
  jobs: Job[]
  currentJob: Job | null
  loading: boolean
  error: string | null
  fetchJobs: (page?: number, filters?: JobFilters) => Promise<void>
  fetchJobById: (id: string) => Promise<void>
  refreshJobs: () => Promise<void>
  setCurrentJob: (job: Job | null) => void
  clearError: () => void
}

const JobContext = createContext<JobContextType | undefined>(undefined)

export const useJobContext = () => {
  const context = useContext(JobContext)
  if (!context) {
    throw new Error("useJobContext must be used within a JobProvider")
  }
  return context
}

interface JobProviderProps {
  children: ReactNode
}

export const JobProvider = ({ children }: JobProviderProps) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [currentJob, setCurrentJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = useCallback(async (page = 1, filters: JobFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      const fetchedJobs = await getJobs(page, filters)
      setJobs(fetchedJobs)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch jobs"
      setError(errorMessage)
      console.error("Error fetching jobs:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchJobById = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const job = await getJobById(id)
      setCurrentJob(job)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch job"
      setError(errorMessage)
      console.error("Error fetching job:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshJobs = useCallback(async () => {
    await fetchJobs()
  }, [fetchJobs])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value: JobContextType = {
    jobs,
    currentJob,
    loading,
    error,
    fetchJobs,
    fetchJobById,
    refreshJobs,
    setCurrentJob,
    clearError,
  }

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>
}
