import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-primary-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <p className="text-center text-gray-600 mb-8">
          Please connect Supabase to enable registration
        </p>
        <Button
          className="w-full bg-primary-600 hover:bg-primary-700 text-white mb-4"
          onClick={() => navigate("/")}
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default Register;