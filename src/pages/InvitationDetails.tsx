import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ElegantTemplate } from "@/components/templates/ElegantTemplate"
import { ModernTemplate } from "@/components/templates/ModernTemplate"
import { FunTemplate } from "@/components/templates/FunTemplate"
import { RSVPResponses } from "@/components/RSVPResponses"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

export default function InvitationDetails() {
  const { id } = useParams<{ id: string }>()

  const { data: invitation, isLoading } = useQuery({
    queryKey: ["invitation", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("invitations").select("*").eq("id", id).single()

      if (error) throw error
      return data
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center text-xl">Invitación no encontrada</p>
      </div>
    )
  }

  const TemplateComponent =
    {
      template1: ElegantTemplate,
      template2: ModernTemplate,
      template3: FunTemplate,
    }[invitation.template_id] || ElegantTemplate

  const shareInvitation = () => {
    const url = `${window.location.origin}/i/${invitation.url_slug}`
    navigator.clipboard.writeText(url).then(() => {
      alert("Enlace de invitación copiado al portapapeles")
    })
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Detalles de la Invitación</span>
            <Button onClick={shareInvitation}>
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Vista previa de la invitación</h2>
            <div className="border rounded-lg overflow-hidden">
              <TemplateComponent {...invitation} />
            </div>
          </div>
          <RSVPResponses invitationId={invitation.id} />
        </CardContent>
      </Card>
    </div>
  )
}

