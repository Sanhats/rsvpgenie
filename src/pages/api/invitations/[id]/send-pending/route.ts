import { NextResponse } from "next/server"
import { supabase } from "@/integrations/supabase/client"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const invitationId = params.id

    // Obtener invitados pendientes
    const { data: pendingGuests, error: fetchError } = await supabase
      .from("invitation_queue")
      .select("*")
      .eq("invitation_id", invitationId)
      .eq("status", "pending")

    if (fetchError) {
      throw new Error(`Error fetching pending guests: ${fetchError.message}`)
    }

    if (!pendingGuests || pendingGuests.length === 0) {
      return NextResponse.json({ error: "No hay invitaciones pendientes para enviar" }, { status: 400 })
    }

    // Aquí iría la lógica para enviar las invitaciones
    // Por ejemplo, enviar SMS o correos electrónicos a los invitados

    // Actualizar el estado de los invitados a 'sent'
    const { error: updateError } = await supabase
      .from("invitation_queue")
      .update({ status: "sent" })
      .eq("invitation_id", invitationId)
      .eq("status", "pending")

    if (updateError) {
      throw new Error(`Error updating guest status: ${updateError.message}`)
    }

    return NextResponse.json({
      message: "Invitations sent successfully",
      guestCount: pendingGuests.length,
    })
  } catch (error) {
    console.error("Error in send-pending route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}

