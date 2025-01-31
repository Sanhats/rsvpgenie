import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4">
        <nav className="py-6 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-600">invita.me</div>
          <div className="space-x-4">
            <Button
              variant="ghost"
              className="text-primary-600 hover:text-primary-700"
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </Button>
            <Button
              className="bg-primary-600 hover:bg-primary-700 text-white"
              onClick={() => navigate("/register")}
            >
              Crear Cuenta
            </Button>
          </div>
        </nav>

        <main className="py-20">
          <div className="max-w-3xl mx-auto text-center animate-fadeIn">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Crea Invitaciones Digitales Hermosas
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Diseña y comparte invitaciones digitales para cualquier ocasión. 
              Gestiona las confirmaciones de asistencia sin complicaciones.
            </p>
            <div className="space-x-4">
              <Button
                size="lg"
                className="bg-primary-600 hover:bg-primary-700 text-white animate-slideUp"
                onClick={() => navigate("/register")}
              >
                Crear Mi Primera Invitación
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-600 text-primary-600 hover:bg-primary-50 animate-slideUp"
                onClick={() => navigate("/templates")}
              >
                Ver Plantillas
              </Button>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Fácil de Crear"
              description="Diseña tu invitación en minutos con nuestro editor intuitivo"
              icon="✨"
            />
            <FeatureCard
              title="Gestión de RSVPs"
              description="Administra tu lista de invitados y rastrea confirmaciones en tiempo real"
              icon="📝"
            />
            <FeatureCard
              title="Comparte al Instante"
              description="Comparte tu invitación por WhatsApp, email o link personalizado"
              icon="🚀"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => (
  <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideUp">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Index;