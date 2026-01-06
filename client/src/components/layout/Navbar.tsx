import { useAuth } from "@/hooks/use-auth";
import { LogOut, Bell, Menu } from "lucide-react";
import { Link } from "wouter";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-[#ED1C24] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button className="p-2 rounded-md hover:bg-white/10 transition">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href={user ? "/dashboard" : "/"} className="font-display font-bold text-2xl tracking-tight">
              Davivienda
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            <span className="text-sm font-medium opacity-90 hover:opacity-100 cursor-pointer">Personas</span>
            <span className="text-sm font-medium opacity-90 hover:opacity-100 cursor-pointer">Empresas</span>
            <span className="text-sm font-medium opacity-90 hover:opacity-100 cursor-pointer">Ayuda</span>
          </div>

          {/* Authenticated User Actions */}
          {user && (
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-white/10 transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full border border-[#ED1C24]"></span>
              </button>
              <button 
                onClick={() => logout()}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition-all text-sm font-medium"
              >
                <span>Salir</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
