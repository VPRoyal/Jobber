import { clsx } from "clsx"
import { Play, Pause, Square } from "lucide-react"

interface StatusBadgeProps {
  status: "active" | "inactive" | "paused"
  showIcon?: boolean
}

const StatusBadge = ({ status, showIcon = true }: StatusBadgeProps) => {
  console.log("Staus", status)
  const config = {
    active: {
      label: "Active",
      className: "badge-success",
      icon: Play,
    },
    paused: {
      label: "Paused",
      className: "badge-warning",
      icon: Pause,
    },
    inactive: {
      label: "Inactive",
      className: "badge-error",
      icon: Square,
    },
  }

  const { label, className, icon: Icon } = config[status]

  return (
    <span className={clsx("badge", className)}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {label}
    </span>
  )
}

export default StatusBadge
