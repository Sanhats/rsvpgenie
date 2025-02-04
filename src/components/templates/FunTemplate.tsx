import { BaseTemplate } from "./BaseTemplate"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Clock, PartyPopper } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface FunTemplateProps {
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

export function FunTemplate({
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
}: FunTemplateProps) {
  const date = new Date(event_date)

  const backgroundStyle = background_image
    ? { backgroundImage: `url(${background_image})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {}

  return (
    <BaseTemplate
      className={cn(
        `min-h-screen flex items-center justify-center p-4`,
        background_image ? "bg-transparent" : `bg-${primary_color}-100`,
      )}
    >
      <Card
        className={cn(
          `w-full max-w-2xl overflow-hidden shadow-lg ${font}`,
          show_border ? `border-${primary_color}-300` : "border-transparent",
          `bg-${primary_color}-200`,
          `text-${text_alignment}`,
        )}
        style={{
          ...backgroundStyle,
          borderRadius: `${border_radius}px`,
          backgroundColor: `rgba(var(--${primary_color}-200), ${opacity / 100})`,
        }}
      >
        <div className="relative px-6 py-16 md:px-12" style={{ backdropFilter: "blur(5px)" }}>
          <div className={cn(`absolute top-0 left-0 right-0 h-2 bg-${secondary_color}-500`)} />
          <div className="flex justify-center mb-6">
            <PartyPopper className={cn(`h-16 w-16 animate-bounce text-${secondary_color}-500`)} />
          </div>
          <h1 className={cn(`text-4xl font-black tracking-tight md:text-5xl mb-4 text-${primary_color}-800`)}>
            {title}
          </h1>
          {description && <p className={cn(`mt-4 text-lg text-${primary_color}-600`)}>{description}</p>}
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Card className={cn(`p-4 border-${primary_color}-300 bg-opacity-20`)}>
              <div className={cn(`flex flex-col items-center gap-2 text-${primary_color}-700`)}>
                <CalendarDays className="h-6 w-6" />
                <span className="text-center font-medium">
                  {format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                </span>
              </div>
            </Card>
            <Card className={cn(`p-4 border-${primary_color}-300 bg-opacity-20`)}>
              <div className={cn(`flex flex-col items-center gap-2 text-${primary_color}-700`)}>
                <Clock className="h-6 w-6" />
                <span className="text-center font-medium">{format(date, "h:mm aaa", { locale: es })}</span>
              </div>
            </Card>
            <Card className={cn(`p-4 border-${primary_color}-300 bg-opacity-20`)}>
              <div className={cn(`flex flex-col items-center gap-2 text-${primary_color}-700`)}>
                <MapPin className="h-6 w-6" />
                <span className="text-center font-medium">{location}</span>
              </div>
            </Card>
          </div>
          {location_url && (
            <div className="mt-8">
              <Button
                asChild
                variant="outline"
                className={cn(
                  `w-full border-${primary_color}-400 hover:bg-${primary_color}-300`,
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

