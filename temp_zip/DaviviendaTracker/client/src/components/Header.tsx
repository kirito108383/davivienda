import { Bell, User, ShieldCheck } from 'lucide-react';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
}

const Header = ({ title, toggleSidebar }: HeaderProps) => {
  const [_, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  // Obtener el usuario actual del cache de react-query
  const user = queryClient.getQueryData<any>(['/api/user']);
  const isAdmin = user?.isAdmin === 1;
  
  return (
    <header className="bg-[#D50000] text-white p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="material-icons cursor-pointer mr-3 md:hidden"
          >
            menu
          </button>
          <span className="font-bold text-lg">{title}</span>
        </div>
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <div 
              className="cursor-pointer relative group"
              onClick={() => navigate('/admin')}
              title="Panel de Administración"
            >
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 rounded-full px-2 py-0.5 text-xs font-bold animate-pulse">
                Admin
              </div>
              <div className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-red-700 text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Panel Admin
              </span>
            </div>
          )}
          <div 
            className="cursor-pointer"
            onClick={() => {
              alert("No hay notificaciones disponibles");
            }}
            title="Notificaciones"
          >
            <Bell className="w-5 h-5" />
          </div>
          <div 
            className="cursor-pointer"
            onClick={() => navigate('/profile')}
            title="Ver perfil"
          >
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
