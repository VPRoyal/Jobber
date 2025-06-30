import { addToast } from "@/components/common/toaster"

export const useToast = () => {
  const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "info", duration = 5000) => {
    addToast(message, type, duration)
  }

  return { showToast }
}
