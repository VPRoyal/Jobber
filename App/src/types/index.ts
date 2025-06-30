export interface Job {
  id: string
  name: string
  cronExpression: string
  status: "active" | "inactive" | "paused"
  lastRunAt?: string
  nextRunAt?: string
  createdAt: string
  updatedAt: string
  description?: string
}

export interface CreateJobPayload {
  name: string
  cronExpression: string
  description?: string
}

export interface JobFilters {
  search?: string
  status?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
