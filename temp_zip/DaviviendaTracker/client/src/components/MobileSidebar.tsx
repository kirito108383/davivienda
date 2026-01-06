import { Link, useLocation } from 'wouter';
import { useStore } from '@/lib/store';
import { Home, SquareSplitHorizontal, CreditCard, History, User, LogOut, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const [location] = useLocation();
  const { user, logout } = useStore();
  
  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Desconocido';
    
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Hoy ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'd MMM, h:mm a', { locale: es });
    }
  };
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const handleLogout = async () => {
    await logout();
    onClose();
  };
  
  const handleNavigation = (path: string) => {
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-20 flex ${isOpen ? '' : 'hidden'}`}>
      <div 
        className="bg-black bg-opacity-50 w-full" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className={`bg-white w-64 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center">
              <User size={20} />
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-gray-500">
                Último ingreso: {formatLastLogin(user?.lastLogin)}
              </p>
            </div>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li className={`nav-item ${isActive('/home') ? 'active' : ''}`}>
              <Link href="/home" onClick={() => handleNavigation('/home')} className={`flex items-center p-2 rounded hover:bg-gray-100 ${isActive('/home') ? 'text-primary' : ''}`}>
                <Home className="mr-3 h-5 w-5" />
                <span>Inicio</span>
              </Link>
            </li>
            <li className={`nav-item ${isActive('/transfers') ? 'active' : ''}`}>
              <Link href="/transfers" onClick={() => handleNavigation('/transfers')} className={`flex items-center p-2 rounded hover:bg-gray-100 ${isActive('/transfers') ? 'text-primary' : ''}`}>
                <SquareSplitHorizontal className="mr-3 h-5 w-5" />
                <span>Transferencias</span>
              </Link>
            </li>
            <li className={`nav-item ${isActive('/payments') ? 'active' : ''}`}>
              <Link href="/payments" onClick={() => handleNavigation('/payments')} className={`flex items-center p-2 rounded hover:bg-gray-100 ${isActive('/payments') ? 'text-primary' : ''}`}>
                <CreditCard className="mr-3 h-5 w-5" />
                <span>Pagos</span>
              </Link>
            </li>
            <li className={`nav-item ${isActive('/history') ? 'active' : ''}`}>
              <Link href="/history" onClick={() => handleNavigation('/history')} className={`flex items-center p-2 rounded hover:bg-gray-100 ${isActive('/history') ? 'text-primary' : ''}`}>
                <History className="mr-3 h-5 w-5" />
                <span>Historial</span>
              </Link>
            </li>
            <li className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
              <Link href="/profile" onClick={() => handleNavigation('/profile')} className={`flex items-center p-2 rounded hover:bg-gray-100 ${isActive('/profile') ? 'text-primary' : ''}`}>
                <User className="mr-3 h-5 w-5" />
                <span>Perfil</span>
              </Link>
            </li>

            
            <li className="mt-8">
              <button onClick={handleLogout} className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-600 w-full">
                <LogOut className="mr-3 h-5 w-5" />
                <span>Cerrar sesión</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileSidebar;
