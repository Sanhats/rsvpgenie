"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface SendInvitationsButtonProps {
  invitationId: string
}

const SendInvitationsButton: React.FC<SendInvitationsButtonProps> = ({ invitationId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const sendInvitations = useMutation({
    mutationFn: async () => {
      // Verificar si hay invitaciones pendientes
      const { data: pendingGuests, error: fetchError } = await supabase
        .from("invitation_queue")
        .select("*")
        .eq("invitation_id", invitationId)
        .eq("status", "pending")

      if (fetchError) throw fetchError

      if (!pendingGuests || pendingGuests.length === 0) {
        throw new Error("No hay invitaciones pendientes para enviar")
      }

      // Llamar al endpoint del bot de WhatsApp para enviar invitaciones
      const response = await fetch(`${import.meta.env.VITE_BOT_API_URL}/api/invitations/send-pending`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invitationId }),
      })

      if (!response.ok) {
        throw new Error("Failed to send invitations through WhatsApp bot")
      }

      const result = await response.json()

      return result
    },
    onSuccess: (data) => {
      toast({
        title: "Éxito",
        description: data.message || "Las invitaciones pendientes han sido enviadas.",
      })
      queryClient.invalidateQueries(["pending_guests", invitationId])
    },
    onError: (error: Error) => {
      console.error("Error sending invitations:", error)
      toast({
        title: "Error",
        description: error.message || "Hubo un problema al enviar las invitaciones. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })

  const handleSendInvitations = () => {
    setIsLoading(true)
    sendInvitations.mutate()
  }

  return (
    <Button onClick={handleSendInvitations} disabled={isLoading}>
      {isLoading ? "Enviando..." : "Enviar invitaciones pendientes"}
    </Button>
  )
}

export default SendInvitationsButton

