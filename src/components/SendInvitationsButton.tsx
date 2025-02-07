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
      // Obtener invitados pendientes
      const { data: pendingGuests, error: fetchError } = await supabase
        .from("invitation_queue")
        .select("*")
        .eq("invitation_id", invitationId)
        .eq("status", "pending")

      if (fetchError) throw fetchError

      if (!pendingGuests || pendingGuests.length === 0) {
        throw new Error("No hay invitaciones pendientes para enviar")
      }

      // Aquí iría la lógica para enviar las invitaciones
      // Por ejemplo, enviar SMS o correos electrónicos a los invitados

      // Actualizar el estado de los invitados a 'sent'
      const { error: updateError } = await supabase
        .from("invitation_queue")
        .update({ status: "sent" })
        .eq("invitation_id", invitationId)
        .eq("status", "pending")

      if (updateError) throw updateError

      return { success: true, message: "Invitaciones enviadas correctamente" }
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Las invitaciones pendientes han sido enviadas.",
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

