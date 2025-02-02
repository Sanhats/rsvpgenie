import { BaseTemplate } from "./BaseTemplate"
import { Card } from "@/components/ui/card"
import { CalendarDays, MapPin, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ElegantTemplateProps {
  title: string
  description?: string | null
  event_date: string
  location: string
}

export function ElegantTemplate({ title, description, event_date, location }: ElegantTemplateProps) {
  const date = new Date(event_date)

  return (
    <BaseTemplate className="bg-gradient-to-b from-rose-50 to-rose-100">
      <Card className="overflow-hidden bg-white/80 backdrop-blur">
        <div className="relative px-6 py-16 md:px-12">
          <div className="absolute inset-0 bg-[url('/elegant-pattern.svg')] opacity-5" />
          <div className="relative">
            <h1 className="text-center font-serif text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {title}
            </h1>
            {description && <p className="mt-6 text-center text-lg text-gray-600">{description}</p>}
            <div className="mt-10 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-gray-700">
                <CalendarDays className="h-5 w-5" />
                <span className="text-lg">{format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="h-5 w-5" />
                <span className="text-lg">{format(date, "h:mm aaa", { locale: es })}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{location}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </BaseTemplate>
  )
}

