import { NavLink, useLocation } from "react-router"
import { Calendar, Plus, Home } from "lucide-react"

const Navbar = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">Jobber</span>
          </NavLink>

          <div className="flex items-center space-x-4">
            <NavLink
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/") ? "bg-primary text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </NavLink>

            <NavLink
              to="/create"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/create") ? "bg-primary text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Job</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
