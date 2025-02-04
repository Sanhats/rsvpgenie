import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ElegantTemplate } from "@/components/templates/ElegantTemplate"
import { ModernTemplate } from "@/components/templates/ModernTemplate"
import { FunTemplate } from "@/components/templates/FunTemplate"
import { RSVPForm } from "@/components/RSVPForm"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function InvitationView() {
  const { slug } = useParams<{ slug: string }>()
  const [timeLeft, setTimeLeft] = useState<string>("")

  const { data: invitation, isLoading } = useQuery({
    queryKey: ["invitation", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("invitations").select("*").eq("url_slug", slug).single()

      if (error) throw error
      return data
    },
  })

  useEffect(() => {
    if (!invitation?.event_date) return

    const calculateTimeLeft = () => {
      const difference = new Date(invitation.event_date).getTime() - new Date().getTime()

      if (difference <= 0) {
        setTimeLeft("¡El evento ya ha pasado!")
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)

      setTimeLeft(`${days}d ${hours}h ${minutes}m`)
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000)

    return () => clearInterval(timer)
  }, [invitation?.event_date])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-[600px] w-full max-w-4xl" />
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Invitación no encontrada</p>
      </div>
    )
  }

  const TemplateComponent =
    {
      template1: ElegantTemplate,
      template2: ModernTemplate,
      template3: FunTemplate,
    }[invitation.template_id] || ElegantTemplate

  return (
    <div className="min-h-screen bg-gray-100">
      <TemplateComponent {...invitation} />
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Confirma tu asistencia</h2>
            <RSVPForm invitationId={invitation.id} />
          </CardContent>
        </Card>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 p-4 text-center text-white backdrop-blur">
        <p className="text-sm font-medium">Tiempo hasta el evento: {timeLeft}</p>
      </div>
    </div>
  )
}

