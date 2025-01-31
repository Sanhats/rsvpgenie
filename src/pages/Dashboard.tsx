import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Invitations</h1>
          <Button
            className="bg-primary-600 hover:bg-primary-700 text-white"
            onClick={() => navigate("/templates")}
          >
            Create New Invitation
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Welcome to Your Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Please connect Supabase to enable invitation management
          </p>
          <Button
            variant="outline"
            className="border-primary-600 text-primary-600 hover:bg-primary-50"
            onClick={() => navigate("/")}
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;