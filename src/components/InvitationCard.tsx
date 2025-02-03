import { Calendar, MapPin, Users, ExternalLink, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Tables } from "@/integrations/supabase/types"
import { Link } from "react-router-dom"

type Invitation = Tables<"invitations"> & {
  rsvp: Tables<"rsvp">[]
}

interface InvitationCardProps {
  invitation: Invitation
}

export function InvitationCard({ invitation }: InvitationCardProps) {
  const totalResponses = invitation.rsvp?.length || 0
  const attending = invitation.rsvp?.filter((r) => r.attending).length || 0

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{invitation.title}</span>
          <Badge variant={getStatusVariant(invitation.event_date)}>{getStatus(invitation.event_date)}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{invitation.description || "Sin descripción"}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-700">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(invitation.event_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="truncate">{invitation.location}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Users className="h-4 w-4 mr-2" />
            <span>
              {attending} / {totalResponses} confirmados
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline" size="sm">
          <Link to={`/invitation/${invitation.id}`}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link to={`/i/${invitation.url_slug}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function getStatus(date: string): string {
  const eventDate = new Date(date)
  const now = new Date()

  if (eventDate < now) {
    return "Pasado"
  } else if (eventDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return "Próximo"
  } else {
    return "Futuro"
  }
}

function getStatusVariant(date: string): "default" | "secondary" | "destructive" {
  const status = getStatus(date)
  switch (status) {
    case "Pasado":
      return "destructive"
    case "Próximo":
      return "default"
    case "Futuro":
      return "secondary"
    default:
      return "default"
  }
}

