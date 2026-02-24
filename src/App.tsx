import { useAuth } from "@/features/auth/hooks/useAuth"
import { LoginPage } from "@/pages/auth/LoginPage"
import { ElevatorDashboard } from "@/features/elevator/components/ElevatorDashboard"

function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {!user ? <LoginPage /> : <ElevatorDashboard />}
    </div>
  )
}

export default App
