import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(100, "El título es muy largo"),
  description: z.string().optional(),
  event_date: z.string().min(1, "La fecha es requerida"),
  location: z.string().min(1, "La ubicación es requerida"),
  template_id: z.string().min(1, "Selecciona una plantilla"),
})

type FormData = z.infer<typeof formSchema>

const templates = [
  { id: "template1", name: "Plantilla Básica" },
  { id: "template2", name: "Plantilla Elegante" },
  { id: "template3", name: "Plantilla Divertida" },
]

export default function CreateInvitation() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      event_date: "",
      location: "",
      template_id: "",
    },
  })

  const createInvitation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!user) throw new Error("No hay usuario autenticado")

      // Crear un slug único basado en el título y timestamp
      const timestamp = new Date().getTime()
      const baseSlug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      const url_slug = `${baseSlug}-${timestamp}`

      const { data: newInvitation, error } = await supabase
        .from("invitations")
        .insert([
          {
            title: data.title,
            description: data.description || null,
            event_date: new Date(data.event_date).toISOString(),
            location: data.location,
            template_id: data.template_id,
            user_id: user.id,
            url_slug,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error creating invitation:", error)
        throw new Error(error.message)
      }

      return newInvitation
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] })
      toast({
        title: "¡Invitación creada!",
        description: "Tu invitación ha sido creada exitosamente.",
      })
      navigate("/dashboard")
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Error al crear la invitación: ${error.message}`,
        variant: "destructive",
      })
      setIsSubmitting(false)
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    createInvitation.mutate(data)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Invitación</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título del Evento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Mi Fiesta de Cumpleaños" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe tu evento..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormDescription>Añade detalles importantes sobre tu evento</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha y Hora</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input placeholder="Dirección del evento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="template_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plantilla</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una plantilla" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creando..." : "Crear Invitación"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

