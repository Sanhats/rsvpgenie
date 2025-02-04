import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { ElegantTemplate } from "@/components/templates/ElegantTemplate"
import { ModernTemplate } from "@/components/templates/ModernTemplate"
import { FunTemplate } from "@/components/templates/FunTemplate"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(100, "El título es muy largo"),
  description: z.string().optional(),
  event_date: z.string().min(1, "La fecha es requerida"),
  location: z.string().min(1, "La ubicación es requerida"),
  location_url: z.string().url("Debe ser una URL válida").optional(),
  template_id: z.string().min(1, "Selecciona una plantilla"),
  font: z.string().min(1, "Selecciona una fuente"),
  primary_color: z.string().min(1, "Selecciona un color primario"),
  secondary_color: z.string().min(1, "Selecciona un color secundario"),
})

type FormData = z.infer<typeof formSchema>

const templates = [
  { id: "template1", name: "Plantilla Elegante" },
  { id: "template2", name: "Plantilla Moderna" },
  { id: "template3", name: "Plantilla Divertida" },
]

const fontOptions = [
  { value: "font-sans", label: "Sans Serif" },
  { value: "font-serif", label: "Serif" },
  { value: "font-mono", label: "Monospace" },
  { value: "font-cursive", label: "Cursive" },
]

const colorOptions = [
  { value: "slate", label: "Slate" },
  { value: "gray", label: "Gray" },
  { value: "zinc", label: "Zinc" },
  { value: "neutral", label: "Neutral" },
  { value: "stone", label: "Stone" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "amber", label: "Amber" },
  { value: "yellow", label: "Yellow" },
  { value: "lime", label: "Lime" },
  { value: "green", label: "Green" },
  { value: "emerald", label: "Emerald" },
  { value: "teal", label: "Teal" },
  { value: "cyan", label: "Cyan" },
  { value: "sky", label: "Sky" },
  { value: "blue", label: "Blue" },
  { value: "indigo", label: "Indigo" },
  { value: "violet", label: "Violet" },
  { value: "purple", label: "Purple" },
  { value: "fuchsia", label: "Fuchsia" },
  { value: "pink", label: "Pink" },
  { value: "rose", label: "Rose" },
]

export default function CreateInvitation() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewData, setPreviewData] = useState<FormData | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      event_date: "",
      location: "",
      location_url: "",
      template_id: "template1",
      font: "font-sans",
      primary_color: "slate",
      secondary_color: "blue",
    },
  })

  const createInvitation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!user) throw new Error("No hay usuario autenticado")

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
            location_url: data.location_url,
            template_id: data.template_id,
            font: data.font,
            primary_color: data.primary_color,
            secondary_color: data.secondary_color,
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

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true)
    createInvitation.mutate(data)
  }

  useEffect(() => {
    const subscription = form.watch((value) => setPreviewData(value as FormData))
    return () => subscription.unsubscribe()
  }, [form.watch])

  const PreviewComponent = previewData
    ? {
        template1: ElegantTemplate,
        template2: ModernTemplate,
        template3: FunTemplate,
      }[previewData.template_id] || ElegantTemplate
    : null

  return (
    <div className="container mx-auto py-10 px-4">
      <Tabs defaultValue="form">
        <TabsList className="mb-4">
          <TabsTrigger value="form">Formulario</TabsTrigger>
          <TabsTrigger value="preview">Vista Previa</TabsTrigger>
        </TabsList>
        <TabsContent value="form">
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
                          <Input placeholder="Nombre del lugar" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enlace de Google Maps</FormLabel>
                        <FormControl>
                          <Input placeholder="https://goo.gl/maps/..." {...field} />
                        </FormControl>
                        <FormDescription>Pega aquí el enlace compartido de Google Maps</FormDescription>
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

                  <FormField
                    control={form.control}
                    name="font"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una fuente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fontOptions.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primary_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Primario</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un color primario" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {colorOptions.map((color) => (
                              <SelectItem key={color.value} value={color.value}>
                                {color.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondary_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Secundario</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un color secundario" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {colorOptions.map((color) => (
                              <SelectItem key={color.value} value={color.value}>
                                {color.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creando..." : "Crear Invitación"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview">
          {previewData && PreviewComponent && (
            <div className="border rounded-lg overflow-hidden">
              <PreviewComponent {...previewData} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

