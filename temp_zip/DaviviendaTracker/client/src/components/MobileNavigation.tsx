import { Link, useLocation } from 'wouter';
import { Home, SquareSplitHorizontal, CreditCard, History, User } from 'lucide-react';

const MobileNavigation = () => {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-10">
      <div className="flex justify-around items-center">
        <Link 
          href="/home" 
          className={`flex flex-col items-center py-2 flex-1 ${isActive('/home') ? 'text-primary' : 'text-gray-500'}`}
        >
          <Home size={20} />
          <span className="text-xs">Inicio</span>
        </Link>
        <Link 
          href="/transfers" 
          className={`flex flex-col items-center py-2 flex-1 ${isActive('/transfers') ? 'text-primary' : 'text-gray-500'}`}
        >
          <SquareSplitHorizontal size={20} />
          <span className="text-xs">Transferir</span>
        </Link>
        <Link 
          href="/payments" 
          className={`flex flex-col items-center py-2 flex-1 ${isActive('/payments') ? 'text-primary' : 'text-gray-500'}`}
        >
          <CreditCard size={20} />
          <span className="text-xs">Pagos</span>
        </Link>
        <Link 
          href="/history" 
          className={`flex flex-col items-center py-2 flex-1 ${isActive('/history') ? 'text-primary' : 'text-gray-500'}`}
        >
          <History size={20} />
          <span className="text-xs">Historial</span>
        </Link>
        <Link 
          href="/profile" 
          className={`flex flex-col items-center py-2 flex-1 ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}
        >
          <User size={20} />
          <span className="text-xs">Perfil</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavigation;
