import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const guestSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Número de teléfono inválido"),
})

type Guest = z.infer<typeof guestSchema>

interface GuestListProps {
  invitationId: string
}

export function GuestList({ invitationId }: GuestListProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [guests, setGuests] = useState<Guest[]>([])

  const form = useForm<Guest>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  })

  const addGuest = (data: Guest) => {
    setGuests([...guests, data])
    form.reset()
  }

  const removeGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index))
  }

  const saveGuestList = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("invitations")
        .update({ guests: JSON.stringify(guests) })
        .eq("id", invitationId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["invitation", invitationId])
      toast({
        title: "Lista de invitados guardada",
        description: "La lista de invitados se ha guardado correctamente.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Error al guardar la lista de invitados: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(addGuest)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del invitado</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormDescription>Incluye el código de país</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Añadir invitado</Button>
        </form>
      </Form>

      {guests.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest, index) => (
              <TableRow key={index}>
                <TableCell>{guest.name}</TableCell>
                <TableCell>{guest.phone}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => removeGuest(index)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {guests.length > 0 && <Button onClick={() => saveGuestList.mutate()}>Guardar lista de invitados</Button>}
    </div>
  )
}

