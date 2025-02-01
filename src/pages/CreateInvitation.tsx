import { InvitationForm } from "@/components/InvitationForm";

export default function CreateInvitation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Crear Nueva Invitación
        </h1>
        <div className="max-w-2xl mx-auto">
          <InvitationForm />
        </div>
      </div>
    </div>
  );
}