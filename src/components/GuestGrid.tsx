import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Guest {
  id: string
  full_name: string
  phone: string
  status: string
}

interface GuestGridProps {
  invitationId: string
}

export function GuestGrid({ invitationId }: GuestGridProps) {
  const {
    data: guests,
    isLoading,
    error,
  } = useQuery<Guest[]>({
    queryKey: ["guests", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("invitation_id", invitationId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  if (isLoading) return <div>Cargando invitados...</div>
  if (error) return <div>Error al cargar los invitados: {(error as Error).message}</div>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests?.map((guest) => (
          <TableRow key={guest.id}>
            <TableCell>{guest.full_name}</TableCell>
            <TableCell>{guest.phone}</TableCell>
            <TableCell>
              <Badge
                variant={
                  guest.status === "confirmed" ? "success" : guest.status === "cancelled" ? "destructive" : "default"
                }
              >
                {guest.status === "pending" ? "Pendiente" : guest.status === "confirmed" ? "Confirmado" : "Cancelado"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

