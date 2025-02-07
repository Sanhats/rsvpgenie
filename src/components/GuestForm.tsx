"use client"

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

const guestSchema = z.object({
  full_name: z.string().min(1, "El nombre completo es requerido"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Número de teléfono inválido"),
})

type GuestFormData = z.infer<typeof guestSchema>

interface GuestFormProps {
  invitationId: string
}

export function GuestForm({ invitationId }: GuestFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      full_name: "",
      phone: "",
    },
  })

  const addGuest = useMutation({
    mutationFn: async (data: GuestFormData) => {
      const { error } = await supabase.from("invitation_queue").insert([
        {
          invitation_id: invitationId,
          full_name: data.full_name,
          phone: data.phone,
          status: "pending",
        },
      ])

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pending_guests", invitationId])
      toast({
        title: "Invitado añadido",
        description: "El invitado ha sido añadido a la cola de invitaciones.",
      })
      form.reset()
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Error al añadir el invitado: ${error.message}`,
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const onSubmit = (data: GuestFormData) => {
    setIsSubmitting(true)
    addGuest.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="Nombre completo del invitado" {...field} />
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Añadiendo..." : "Añadir invitado"}
        </Button>
      </form>
    </Form>
  )
}

