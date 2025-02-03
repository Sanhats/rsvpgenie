import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export default function Index() {
  const { user } = useAuth()

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Crea invitaciones</span>{" "}
                <span className="block text-indigo-600 xl:inline">únicas y memorables</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                Diseña, personaliza y comparte tus invitaciones para cualquier ocasión. Gestiona fácilmente las
                respuestas de tus invitados y haz que tu evento sea inolvidable.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                {user ? (
                  <div className="rounded-md shadow">
                    <Link to="/dashboard">
                      <Button size="lg">Ir al Dashboard</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md shadow">
                      <Link to="/register">
                        <Button size="lg">Regístrate Gratis</Button>
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link to="/login">
                        <Button variant="outline" size="lg">
                          Iniciar Sesión
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
          alt="Celebración de evento"
        />
      </div>
    </div>
  )
}

