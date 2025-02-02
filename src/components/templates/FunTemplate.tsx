import { BaseTemplate } from "./BaseTemplate"
import { Card } from "@/components/ui/card"
import { CalendarDays, MapPin, Clock, PartyPopperIcon as Party } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface FunTemplateProps {
  title: string
  description?: string | null
  event_date: string
  location: string
}

export function FunTemplate({ title, description, event_date, location }: FunTemplateProps) {
  const date = new Date(event_date)

  return (
    <BaseTemplate className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
      <div className="relative">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 opacity-50 blur-3xl" />
        <Card className="relative overflow-hidden border-4 border-white bg-white/90 shadow-xl">
          <div className="px-6 py-16 md:px-12">
            <div className="flex justify-center">
              <Party className="h-16 w-16 animate-bounce text-pink-500" />
            </div>
            <h1 className="mt-6 text-center font-sans text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
              {title}
            </h1>
            {description && <p className="mt-6 text-center text-lg text-gray-600">{description}</p>}
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <Card className="border-2 border-pink-200 bg-pink-50 p-4">
                <div className="flex flex-col items-center gap-2 text-pink-700">
                  <CalendarDays className="h-6 w-6" />
                  <span className="text-center font-medium">
                    {format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                  </span>
                </div>
              </Card>
              <Card className="border-2 border-purple-200 bg-purple-50 p-4">
                <div className="flex flex-col items-center gap-2 text-purple-700">
                  <Clock className="h-6 w-6" />
                  <span className="text-center font-medium">{format(date, "h:mm aaa", { locale: es })}</span>
                </div>
              </Card>
              <Card className="border-2 border-yellow-200 bg-yellow-50 p-4">
                <div className="flex flex-col items-center gap-2 text-yellow-700">
                  <MapPin className="h-6 w-6" />
                  <span className="text-center font-medium">{location}</span>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </BaseTemplate>
  )
}

