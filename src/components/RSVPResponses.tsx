import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"

interface RSVPResponse {
  id: string
  name: string
  email: string
  attending: boolean
  created_at: string
}

interface RSVPResponsesProps {
  invitationId: string
}

export function RSVPResponses({ invitationId }: RSVPResponsesProps) {
  const {
    data: responses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rsvp-responses", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rsvp")
        .select("*")
        .eq("invitation_id", invitationId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as RSVPResponse[]
    },
  })

  if (isLoading) return <div>Cargando respuestas...</div>
  if (error) return <div>Error al cargar las respuestas: {(error as Error).message}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Respuestas RSVP</CardTitle>
      </CardHeader>
      <CardContent>
        {responses && responses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Asistencia</TableHead>
                <TableHead>Fecha de Respuesta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell>{response.name}</TableCell>
                  <TableCell>{response.email}</TableCell>
                  <TableCell>
                    {response.attending ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>{new Date(response.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>Aún no hay respuestas RSVP para esta invitación.</p>
        )}
      </CardContent>
    </Card>
  )
}

