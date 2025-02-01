import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Tables } from "@/integrations/supabase/types"
import { useQuery } from "@tanstack/react-query"
import { PlusCircle } from "lucide-react"
import { InvitationCard } from "@/components/InvitationCard"

type Invitation = Tables<"invitations">

const fetchInvitations = async (): Promise<Invitation[]> => {
  const { data, error } = await supabase.from("invitations").select("*").order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return data as Invitation[]
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        navigate("/login")
      }
    }
    checkAuth()
  }, [navigate])

  // Fetch invitations
  const {
    data: invitations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invitations"],
    queryFn: fetchInvitations,
  })

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Could not load invitations",
        variant: "destructive",
      })
    }
  }, [error, toast])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading your invitations...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Invitations</h1>
          <Button onClick={() => navigate("/templates")} className="bg-primary hover:bg-primary/90 text-white">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Invitation
          </Button>
        </div>

        {invitations?.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Welcome to Your Dashboard</h2>
            <p className="text-gray-600 mb-6">
              You haven't created any invitations yet. Start by creating your first one!
            </p>
            <Button
              onClick={() => navigate("/templates")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary-50"
            >
              Choose a Template
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations?.map((invitation) => (
              <InvitationCard key={invitation.id} invitation={invitation} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

