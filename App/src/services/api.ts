import axios from "axios"
import type { Job, CreateJobPayload, JobFilters, JobTypes } from "../types"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken")
      window.location.href = "/login"
    }

    // Enhanced error handling
    const message = error.response?.data?.message || error.message || "An unexpected error occurred"
    return Promise.reject(new Error(message))
  },
)

export const getJobs = async (page = 1, filters: JobFilters = {}): Promise<Job[]> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "50",
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null)),
    })

    const response = await api.get(`/jobs?${params}`)
    console.log("Jobs fetched:", response)
    return response.data.jobs || response.data || []
  } catch (error) {
    console.error("Error fetching jobs:", error)
    throw error
  }
}

export const getJobById = async (id: string): Promise<Job> => {
  try {
    const response = await api.get(`/jobs/${id}`)
    return response.data.job || response.data
  } catch (error) {
    console.error("Error fetching job:", error)
    throw error
  }
}

export const createJob = async (payload: CreateJobPayload): Promise<Job> => {
  try {
    const response = await api.post("/jobs/create", payload)
    return response.data.job || response.data
  } catch (error) {
    console.error("Error creating job:", error)
    throw error
  }
}

export const updateJob = async (id: string, payload: Partial<CreateJobPayload>): Promise<Job> => {
  try {
    const response = await api.put(`/jobs/${id}`, payload)
    return response.data.job || response.data
  } catch (error) {
    console.error("Error updating job:", error)
    throw error
  }
}

export const deleteJob = async (id: string): Promise<void> => {
  try {
    await api.delete(`/jobs/${id}`)
  } catch (error) {
    console.error("Error deleting job:", error)
    throw error
  }
}
export const getAvailableServices = async (): Promise<JobTypes[]> => {
  try {
    const response = await api.get("/jobs/types")
    return response.data.services || []
  } catch (error) {
    console.error("Error fetching available job types:", error)
    throw error
  }
}

export default api
