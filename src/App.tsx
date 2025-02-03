import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"
import { Navigation } from "@/components/Navigation"
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import CreateInvitation from "@/pages/CreateInvitation"
import InvitationView from "@/pages/InvitationView"
import InvitationDetails from "@/pages/InvitationDetails"
import EditInvitation from "@/pages/EditInvitation"
import NotFound from "@/pages/NotFound"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <main className="py-10">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-invitation" element={<CreateInvitation />} />
                <Route path="/i/:slug" element={<InvitationView />} />
                <Route path="/invitation/:id" element={<InvitationDetails />} />
                <Route path="/edit-invitation/:id" element={<EditInvitation />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App

