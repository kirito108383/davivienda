import { useState, useEffect, useRef } from 'react';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useStore } from '@/lib/store';
import { useLocation } from 'wouter';
import { Home, Send, Wallet, CreditCard, User, Menu, Plus, ArrowDown, QrCode, Banknote } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

// Componente de barras de estado simuladas (para dar apariencia de sistema operativo móvil)
const StatusBar = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000); // actualizar cada minuto
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-[#D50000] text-white h-6 px-3 flex justify-between items-center text-xs">
      <div>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="flex items-center space-x-1">
        <div className="flex items-center space-x-0.5">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-2 w-0.5 bg-white rounded-sm" style={{ height: `${n * 2 + 2}px` }}></div>
          ))}
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
            <path d="M19.55 4.1l-.3 1.7a7.34 7.34 0 010 12.4l.3 1.7A9 9 0 0019.55 4.1zM15.78 7.39l-.35 1.75a3.35 3.35 0 010 5.72l.35 1.75a5 5 0 000-9.22zM8 10v4a1 1 0 001 1h2a1 1 0 001-1v-4a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
            <path d="M4.26 15H3a1 1 0 01-1-1v-4a1 1 0 011-1h1.26a8 8 0 000 6z" />
          </svg>
        </div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
            <path d="M17 6H7a5 5 0 00-5 5v2a5 5 0 005 5h10a5 5 0 005-5v-2a5 5 0 00-5-5zm0 10H7a3 3 0 01-3-3v-2a3 3 0 013-3h10a3 3 0 013 3v2a3 3 0 01-3 3z" />
            <path d="M20.25 11.75H17v.5h3.25a.25.25 0 00.25-.25v-.25h-.25z" />
            <circle cx="7" cy="12" r="1" />
            <circle cx="10" cy="12" r="1" />
            <circle cx="13" cy="12" r="1" />
          </svg>
        </div>
        <div className="font-semibold">100%</div>
      </div>
    </div>
  );
};

// Componente de barra inferior de navegación (estilo iOS/Android)
const BottomNavBar = () => {
  const [_, navigate] = useLocation();
  const [location] = useLocation();
  
  // Función para verificar si una ruta está activa
  const isActive = (path: string) => location === path;
  
  return (
    <div className="mobile-footer shadow-lg border-t border-gray-200">
      <div className="mobile-nav">
        <button
          onClick={() => navigate('/home')}
          className={`mobile-nav-item ${isActive('/home') ? 'text-[#D50000]' : 'text-gray-500'}`}
        >
          <Home className="mobile-nav-icon" size={20} />
          <span>Inicio</span>
        </button>
        
        <button
          onClick={() => navigate('/transfers')}
          className={`mobile-nav-item ${isActive('/transfers') ? 'text-[#D50000]' : 'text-gray-500'}`}
        >
          <Send className="mobile-nav-icon" size={20} />
          <span>Enviar</span>
        </button>
        
        <button
          onClick={() => navigate('/qr')}
          className="relative"
        >
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#D50000] rounded-full p-3 shadow-lg border-4 border-white">
            <QrCode className="text-white" size={22} />
          </div>
          <div className="mobile-nav-item pt-6 text-gray-500">
            <span>QR</span>
          </div>
        </button>
        
        <button
          onClick={() => navigate('/payments')}
          className={`mobile-nav-item ${isActive('/payments') ? 'text-[#D50000]' : 'text-gray-500'}`}
        >
          <CreditCard className="mobile-nav-icon" size={20} />
          <span>Pagos</span>
        </button>
        
        <button
          onClick={() => navigate('/profile')}
          className={`mobile-nav-item ${isActive('/profile') ? 'text-[#D50000]' : 'text-gray-500'}`}
        >
          <User className="mobile-nav-icon" size={20} />
          <span>Perfil</span>
        </button>
      </div>
    </div>
  );
};

// Efecto de transición entre páginas
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fade-in mobile-content hide-scrollbar">
      {children}
    </div>
  );
};

// Detector de gestos para simular gestos nativos
const GestureDetector = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [_, navigate] = useLocation();
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isGestureActive, setIsGestureActive] = useState(false);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setIsGestureActive(true);
  };
  
  const handleTouchEnd = () => {
    setIsGestureActive(false);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isGestureActive) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;
    
    // Si es un gesto horizontal fuerte (como volver atrás)
    if (Math.abs(diffX) > 100 && Math.abs(diffY) < 50) {
      if (diffX > 0) {
        // Gesto de derecha a izquierda
        navigate('/home');
      }
    }
  };
  
  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex-1"
    >
      {children}
    </div>
  );
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const {
    isReceiveMoneyModalOpen,
    isAddMoneyModalOpen,
    isWithdrawMoneyModalOpen
  } = useStore();

  return (
    <div className="mobile-container">
      {/* Barra de estado simulada del dispositivo */}
      <StatusBar />
      
      {/* Contenedor principal con detector de gestos */}
      <GestureDetector>
        {/* Contenido principal con transición */}
        <PageTransition>
          {children}
        </PageTransition>
      </GestureDetector>
      
      {/* Barra de navegación inferior */}
      <BottomNavBar />
      
      {/* Loading overlay */}
      <LoadingOverlay />
    </div>
  );
};

export default AppLayout;
