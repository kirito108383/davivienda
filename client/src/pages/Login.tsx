import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/Input";
import { ShieldCheck, Lock, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Login() {
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn, user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document || !password) {
      toast({
        title: "Error",
        description: "Por favor ingrese documento y clave",
        variant: "destructive",
      });
      return;
    }

    try {
      await login({ username: document, password });
    } catch (error: any) {
      toast({
        title: "Acceso denegado",
        description: error.message || "Credenciales incorrectas",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Red Bar */}
        <div className="bg-[#ED1C24] p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h2 className="text-white text-2xl font-bold font-display relative z-10">Davivienda</h2>
          <p className="text-white/90 text-sm mt-1 font-medium relative z-10">Sucursal Virtual Personas</p>
        </div>

        {/* Form Container */}
        <div className="p-8">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#ED1C24]" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                label="Número de documento"
                placeholder="Ingrese su documento"
                type="text"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                className="pl-10"
              />
              <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-[38px]" />
            </div>

            <div className="relative">
              <Input
                label="Clave virtual"
                placeholder="********"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-[38px]" />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#ED1C24] hover:bg-[#C4151C] text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? "Ingresando..." : "Ingresar"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <a href="#" className="text-sm text-gray-500 hover:text-[#ED1C24] font-medium transition-colors">
              ¿Olvidó su clave?
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-400">
        <p>© 2024 Banco Davivienda S.A. Todos los derechos reservados.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <span>Privacidad</span>
          <span>Seguridad</span>
          <span>Términos</span>
        </div>
      </div>
    </div>
  );
}
