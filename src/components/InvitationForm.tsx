import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { Calendar } from "lucide-react";

interface InvitationFormData {
  title: string;
  description?: string;
  event_date: string;
  location?: string;
}

export function InvitationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<InvitationFormData>();

  const onSubmit = async (data: InvitationFormData) => {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
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
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ej: ¡Ven a celebrar conmigo!"
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
              <FormLabel>Fecha del Evento</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type="datetime-local" {...field} />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
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
              <FormLabel>Ubicación</FormLabel>
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

        <div className="flex gap-4">
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
  );
}