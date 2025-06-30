"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { clsx } from "clsx"

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
}

interface ToasterProps {
  toasts: Toast[]
  removeToast: (id: string) => void
}

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove()
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration])

  const handleRemove = () => {
    setIsLeaving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const Icon = icons[toast.type]

  const colorClasses = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  }

  const iconColorClasses = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  }

  return (
    <div
      className={clsx(
        "flex items-center gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 transform",
        colorClasses[toast.type],
        isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        isLeaving && "-translate-x-full opacity-0",
      )}
    >
      <Icon className={clsx("h-5 w-5 flex-shrink-0", iconColorClasses[toast.type])} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button onClick={handleRemove} className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

const ToasterContainer = ({ toasts, removeToast }: ToasterProps) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

// Global toast state
let toasts: Toast[] = []
let listeners: ((toasts: Toast[]) => void)[] = []

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...toasts]))
}

export const addToast = (message: string, type: Toast["type"] = "info", duration = 5000) => {
  const id = Math.random().toString(36).substr(2, 9)
  const toast: Toast = { id, message, type, duration }
  toasts.push(toast)
  notifyListeners()
}

export const removeToast = (id: string) => {
  toasts = toasts.filter((toast) => toast.id !== id)
  notifyListeners()
}

export const Toaster = () => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts)
    }

    listeners.push(listener)

    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  return <ToasterContainer toasts={currentToasts} removeToast={removeToast} />
}
