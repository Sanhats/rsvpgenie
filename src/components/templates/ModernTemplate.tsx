import { BaseTemplate } from "./BaseTemplate"
import { Card } from "@/components/ui/card"
import { CalendarDays, MapPin, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ModernTemplateProps {
  title: string
  description?: string | null
  event_date: string
  location: string
}

export function ModernTemplate({ title, description, event_date, location }: ModernTemplateProps) {
  const date = new Date(event_date)

  return (
    <BaseTemplate className="bg-gradient-to-br from-violet-400 to-indigo-600">
      <Card className="overflow-hidden border-0 bg-white/10 backdrop-blur-lg">
        <div className="px-6 py-16 md:px-12">
          <h1 className="text-center font-sans text-4xl font-bold tracking-tight text-white md:text-5xl">{title}</h1>
          {description && <p className="mt-6 text-center text-lg text-white/90">{description}</p>}
          <div className="mt-10 space-y-6">
            <Card className="border-0 bg-white/20 p-4 backdrop-blur">
              <div className="flex items-center gap-3 text-white">
                <CalendarDays className="h-5 w-5" />
                <span className="text-lg">{format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</span>
              </div>
            </Card>
            <Card className="border-0 bg-white/20 p-4 backdrop-blur">
              <div className="flex items-center gap-3 text-white">
                <Clock className="h-5 w-5" />
                <span className="text-lg">{format(date, "h:mm aaa", { locale: es })}</span>
              </div>
            </Card>
            <Card className="border-0 bg-white/20 p-4 backdrop-blur">
              <div className="flex items-center gap-3 text-white">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{location}</span>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </BaseTemplate>
  )
}

