import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Type, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(100, "El título es muy largo"),
  description: z.string().optional(),
  event_date: z.string().min(1, "La fecha es requerida"),
  location: z.string().optional(),
  template_id: z.string().optional(),
});

const templates = [
  { id: "elegant", name: "Elegante", description: "Diseño clásico y sofisticado" },
  { id: "modern", name: "Moderno", description: "Estilo contemporáneo y minimalista" },
  { id: "fun", name: "Divertido", description: "Diseño alegre y colorido" },
];

export function InvitationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      event_date: "",
      location: "",
      template_id: "elegant",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.from("invitations").insert({
        ...data,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "La invitación ha sido creada correctamente.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating invitation:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la invitación. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Título
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Fiesta de Cumpleaños" {...field} />
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
                <FormLabel className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Descripción
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ej: ¡Ven a celebrar conmigo!"
                    className="min-h-[100px]"
                    {...field}
                  />
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
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha del Evento
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="datetime-local" {...field} />
                  </div>
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
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Ubicación
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Av. Principal 123, Ciudad"
                    {...field}
                  />
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
                        {template.name} - {template.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Crear Invitación
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}