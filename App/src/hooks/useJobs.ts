"use client"

import { useJobContext } from "@/contexts/jobContex"

export const useJobs = () => {
  return useJobContext()
}
