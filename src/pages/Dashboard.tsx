import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { InvitationCard } from "@/components/InvitationCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "react-router-dom"
import { PlusCircle, Calendar, Users, CheckCircle } from "lucide-react"

export default function Dashboard() {
  const { user } = useAuth()

  const { data: invitations, isLoading } = useQuery({
    queryKey: ["invitations", user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from("invitations")
        .select("*, rsvp(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const totalInvitations = invitations?.length || 0
  const totalRSVPs = invitations?.reduce((sum, inv) => sum + (inv.rsvp?.length || 0), 0) || 0
  const totalAttending =
    invitations?.reduce((sum, inv) => sum + (inv.rsvp?.filter((r) => r.attending).length || 0), 0) || 0

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <div
          className="grid gri

d grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/create-invitation">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Invitación
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invitaciones</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvitations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total RSVPs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRSVPs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Asistentes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttending}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Tus Invitaciones</h2>
      {invitations && invitations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((invitation) => (
            <InvitationCard key={invitation.id} invitation={invitation} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Aún no has creado ninguna invitación.</p>
      )}
    </div>
  )
}

