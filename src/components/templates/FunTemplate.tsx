import { BaseTemplate } from "./BaseTemplate"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Clock, PartyPopper } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn, getColorClasses } from "./utils"

interface FunTemplateProps {
  title: string
  description?: string | null
  event_date: string
  location: string
  locationUrl?: string
  font: string
  primaryColor: string
  secondaryColor: string
}

export function FunTemplate({
  title,
  description,
  event_date,
  location,
  locationUrl,
  font,
  primaryColor,
  secondaryColor,
}: FunTemplateProps) {
  const date = new Date(event_date)
  const colors = getColorClasses("template3", primaryColor, secondaryColor)

  return (
    <BaseTemplate className={cn(colors.bg, colors.text, "min-h-screen flex items-center justify-center p-4")}>
      <Card className={cn("w-full max-w-2xl overflow-hidden shadow-lg", font, colors.border, colors.card)}>
        <div className="relative px-6 py-16 md:px-12">
          <div className={cn("absolute top-0 left-0 right-0 h-2", colors.accent)} />
          <div className="flex justify-center mb-6">
            <PartyPopper className={cn("h-16 w-16 animate-bounce", colors.accent)} />
          </div>
          <h1 className={cn("text-center text-4xl font-black tracking-tight md:text-5xl mb-4", colors.text)}>
            {title}
          </h1>
          {description && <p className={cn("mt-4 text-center text-lg", colors.text)}>{description}</p>}
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Card className={cn("p-4", colors.border, "bg-opacity-20")}>
              <div className={cn("flex flex-col items-center gap-2", colors.text)}>
                <CalendarDays className="h-6 w-6" />
                <span className="text-center font-medium">
                  {format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                </span>
              </div>
            </Card>
            <Card className={cn("p-4", colors.border, "bg-opacity-20")}>
              <div className={cn("flex flex-col items-center gap-2", colors.text)}>
                <Clock className="h-6 w-6" />
                <span className="text-center font-medium">{format(date, "h:mm aaa", { locale: es })}</span>
              </div>
            </Card>
            <Card className={cn("p-4", colors.border, "bg-opacity-20")}>
              <div className={cn("flex flex-col items-center gap-2", colors.text)}>
                <MapPin className="h-6 w-6" />
                <span className="text-center font-medium">{location}</span>
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

