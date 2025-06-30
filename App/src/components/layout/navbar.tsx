import { NavLink, useLocation } from "react-router"
import { Calendar, Plus, Home, Settings, Bell } from "lucide-react"
import { clsx } from "clsx"

const Navbar = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/create", label: "Create Job", icon: Plus },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg group-hover:shadow-xl transition-shadow">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Jobber</h1>
              <p className="text-xs text-gray-500">Job Scheduler</p>
            </div>
          </NavLink>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={clsx(
                  "flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive(path)
                    ? "bg-primary-100 text-primary-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}

            {/* Additional actions */}
            <div className="ml-4 flex items-center space-x-2">
              <button className="btn-ghost btn-sm">
                <Bell className="h-4 w-4" />
              </button>
              <button className="btn-ghost btn-sm">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
