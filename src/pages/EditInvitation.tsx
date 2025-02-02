import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  event_date: z.string().min(1, "Event date is required"),
  location: z.string().min(1, "Location is required"),
  template_id: z.string().min(1, "Template selection is required"),
})

type FormData = z.infer<typeof formSchema>

const templates = [
  { id: "template1", name: "Elegant Template" },
  { id: "template2", name: "Modern Template" },
  { id: "template3", name: "Fun Template" },
]

export default function EditInvitation() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: invitation, isLoading } = useQuery({
    queryKey: ["invitation", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("invitations").select("*").eq("id", id).single()

      if (error) throw error
      return data
    },
  })

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: invitation?.title || "",
      description: invitation?.description || "",
      event_date: invitation?.event_date ? new Date(invitation.event_date).toISOString().slice(0, 16) : "",
      location: invitation?.location || "",
      template_id: invitation?.template_id || "",
    },
  })

  const updateInvitation = useMutation({
    mutationFn: async (data: FormData) => {
      const { error } = await supabase
        .from("invitations")
        .update({
          title: data.title,
          description: data.description,
          event_date: new Date(data.event_date).toISOString(),
          location: data.location,
          template_id: data.template_id,
        })
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["invitation", id])
      toast({
        title: "Success",
        description: "Invitation updated successfully!",
      })
      navigate("/dashboard")
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update invitation: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: FormData) => {
    updateInvitation.mutate(data)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!invitation) {
    return <div>Invitation not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Invitation</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
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
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Template</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
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
              <Button type="submit">Update Invitation</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

