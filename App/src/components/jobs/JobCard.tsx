import { NavLink } from "react-router"
import { Calendar, Clock, Play, MoreHorizontal } from "lucide-react"
import type { Job } from "@/types"
import StatusBadge from "@/components/common/statusBadge"

interface JobCardProps {
  job: Job
}

const JobCard = ({ job }: JobCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="card group hover:shadow-lg transition-all duration-200 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <NavLink to={`/jobs/${job.id}`} className="block">
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
              {job.name}
            </h3>
          </NavLink>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={job.status} />
          </div>
        </div>

        <button className="btn-ghost btn-sm p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {job.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>}

      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-400" />
          <span>Last: {job.lastRunAt ? formatDate(job.lastRunAt) : "Never"}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          <span>Next: {job.nextRunAt ? formatDate(job.nextRunAt) : "Not scheduled"}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">{job.cronExpression}</code>

        <div className="flex items-center gap-1">
          <button className="btn-ghost btn-sm p-1.5" title="Run now">
            <Play className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default JobCard
