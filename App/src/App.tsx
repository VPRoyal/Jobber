import { Suspense } from "react"
import { JobProvider } from "./contexts/jobContex"
import { Toaster } from "@/components/common/toaster"
import Navbar from "@/components/layout/navbar"
import LoadingSpinner from "@/components/common/loadingSpinner"
import ErrorBoundary from "@/components/common/errorBoundary"
import { Outlet } from "react-router"
function App() {
  return (
    <ErrorBoundary>
      <JobProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8 max-w-7xl">
              <Suspense fallback={<LoadingSpinner size="lg" />}>
              <Outlet />
              {/* This is where the nested routes will render */}
              </Suspense>
            </main>
            <Toaster />
          </div>
      </JobProvider>
    </ErrorBoundary>
  )
}

export default App
