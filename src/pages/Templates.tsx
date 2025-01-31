import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Templates = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Choose Your Template
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TemplateCard
            title="Classic Elegance"
            description="A timeless design perfect for weddings and formal events"
            image="https://via.placeholder.com/300x400"
          />
          <TemplateCard
            title="Birthday Fun"
            description="Colorful and playful design for birthday celebrations"
            image="https://via.placeholder.com/300x400"
          />
          <TemplateCard
            title="Modern Minimal"
            description="Clean and contemporary design for any occasion"
            image="https://via.placeholder.com/300x400"
          />
        </div>
      </div>
    </div>
  );
};

const TemplateCard = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
        Use This Template
      </Button>
    </div>
  </div>
);

export default Templates;