import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import CreateInvitation from "@/pages/CreateInvitation"
import EditInvitation from "@/pages/EditInvitation"
import InvitationView from "@/pages/InvitationView"
import InvitationDetails from "@/pages/InvitationDetails"
import NotFound from "@/pages/NotFound"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-invitation" element={<CreateInvitation />} />
            <Route path="/edit-invitation/:id" element={<EditInvitation />} />
            <Route path="/invitation/:id" element={<InvitationDetails />} />
            <Route path="/i/:slug" element={<InvitationView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App

