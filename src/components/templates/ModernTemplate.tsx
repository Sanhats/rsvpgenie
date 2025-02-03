import { BaseTemplate } from "./BaseTemplate"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Clock, Zap } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn, getColorClasses } from "./utils"

interface ModernTemplateProps {
  title: string
  description?: string | null
  event_date: string
  location: string
  locationUrl?: string
  font: string
  primaryColor: string
  secondaryColor: string
}

export function ModernTemplate({
  title,
  description,
  event_date,
  location,
  locationUrl,
  font,
  primaryColor,
  secondaryColor,
}: ModernTemplateProps) {
  const date = new Date(event_date)
  const colors = getColorClasses("template2", primaryColor, secondaryColor)

  return (
    <BaseTemplate className={cn(colors.bg, colors.text, "min-h-screen flex items-center justify-center p-4")}>
      <Card className={cn("w-full max-w-2xl overflow-hidden shadow-2xl", font, colors.border, colors.card)}>
        <div className="px-6 py-16 md:px-12">
          <div className="flex justify-center mb-6">
            <Zap className={cn("h-12 w-12", colors.accent)} />
          </div>
          <h1 className={cn("text-center text-4xl font-bold tracking-tight md:text-5xl mb-4", colors.text)}>{title}</h1>
          {description && <p className={cn("mt-4 text-center text-lg", colors.text)}>{description}</p>}
          <div className="mt-10 space-y-6">
            <Card className={cn("p-4", colors.border, "bg-opacity-20")}>
              <div className={cn("flex items-center gap-3", colors.text)}>
                <CalendarDays className="h-5 w-5" />
                <span className="text-lg">{format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</span>
              </div>
            </Card>
            <Card className={cn("p-4", colors.border, "bg-opacity-20")}>
              <div className={cn("flex items-center gap-3", colors.text)}>
                <Clock className="h-5 w-5" />
                <span className="text-lg">{format(date, "h:mm aaa", { locale: es })}</span>
              </div>
            </Card>
            <Card className={cn("p-4", colors.border, "bg-opacity-20")}>
              <div className={cn("flex items-center gap-3", colors.text)}>
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{location}</span>
              </div>
            </Card>
          </div>
          {locationUrl && (
            <div className="mt-8">
              <Button asChild variant="outline" className={cn("w-full", colors.border, colors.hover)}>
                <a href={locationUrl} target="_blank" rel="noopener noreferrer">
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

