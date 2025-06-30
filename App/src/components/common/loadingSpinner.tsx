import { clsx } from "clsx"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className={clsx("loading-spinner", sizeClasses[size], className)} />
    </div>
  )
}

export default LoadingSpinner
