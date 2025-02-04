import { BaseTemplate } from "./BaseTemplate"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface ElegantTemplateProps {
  title: string
  description?: string | null
  event_date: string
  location: string
  location_url?: string
  font: string
  primary_color: string
  secondary_color: string
  background_image?: string
  text_alignment: "left" | "center" | "right"
  show_border: boolean
  border_radius: number
  opacity: number
}

export function ElegantTemplate({
  title,
  description,
  event_date,
  location,
  location_url,
  font,
  primary_color,
  secondary_color,
  background_image,
  text_alignment,
  show_border,
  border_radius,
  opacity,
}: ElegantTemplateProps) {
  const date = new Date(event_date)

  const backgroundStyle = background_image
    ? { backgroundImage: `url(${background_image})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {}

  return (
    <BaseTemplate
      className={cn(
        `min-h-screen flex items-center justify-center p-4`,
        background_image ? "bg-transparent" : `bg-${primary_color}-50`,
      )}
    >
      <Card
        className={cn(
          `w-full max-w-2xl overflow-hidden shadow-xl ${font}`,
          show_border ? `border-${primary_color}-200` : "border-transparent",
          `bg-${primary_color}-100`,
          `text-${text_alignment}`,
        )}
        style={{
          ...backgroundStyle,
          borderRadius: `${border_radius}px`,
          backgroundColor: `rgba(var(--${primary_color}-100), ${opacity / 100})`,
        }}
      >
        <div className="relative px-6 py-16 md:px-12" style={{ backdropFilter: "blur(5px)" }}>
          <h1
            className={cn(`font-serif text-4xl font-bold tracking-tight md:text-5xl mb-4`, `text-${primary_color}-900`)}
          >
            {title}
          </h1>
          {description && <p className={cn(`mt-4 text-lg text-${primary_color}-700`)}>{description}</p>}
          <div className="mt-10 space-y-6">
            <div className={cn(`flex items-center gap-3 text-${primary_color}-700`)}>
              <CalendarDays className="h-5 w-5" />
              <span className="text-lg">{format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</span>
            </div>
            <div className={cn(`flex items-center gap-3 text-${primary_color}-700`)}>
              <Clock className="h-5 w-5" />
              <span className="text-lg">{format(date, "h:mm aaa", { locale: es })}</span>
            </div>
            <div className={cn(`flex items-center gap-3 text-${primary_color}-700`)}>
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{location}</span>
            </div>
          </div>
          {location_url && (
            <div className="mt-8">
              <Button
                asChild
                variant="outline"
                className={cn(
                  `w-full border-${primary_color}-300 hover:bg-${primary_color}-200`,
                  `text-${secondary_color}-600 hover:text-${secondary_color}-700`,
                )}
              >
                <a href={location_url} target="_blank" rel="noopener noreferrer">
                  Ver ubicación en Google Maps
                </a>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </BaseTemplate>
  )
}

