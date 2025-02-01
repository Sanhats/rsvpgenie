import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import CreateInvitation from "@/pages/CreateInvitation";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invitations/new" element={<CreateInvitation />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;