import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Tables } from "@/integrations/supabase/types"
import { useNavigate } from "react-router-dom"

type Invitation = Tables<"invitations">

interface InvitationCardProps {
  invitation: Invitation
}

export function InvitationCard({ invitation }: InvitationCardProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden animate-fadeIn">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{invitation.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{invitation.description || "No description"}</p>
        <div className="flex flex-col space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(invitation.event_date).toLocaleDateString()}</span>
          </div>
          {invitation.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{invitation.location}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/invitation/${invitation.id}`)} className="flex-1">
            View Details
          </Button>
          <Button onClick={() => navigate(`/edit-invitation/${invitation.id}`)} variant="outline" className="flex-1">
            Edit
          </Button>
        </div>
      </div>
    </div>
  )
}

