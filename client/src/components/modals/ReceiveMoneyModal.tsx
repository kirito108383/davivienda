import { useStore } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Share, Copy, Check, RefreshCcw } from 'lucide-react';
import { Account } from '@/types';
import { useState, useEffect } from 'react';

export const ReceiveMoneyModal = () => {
  const { isReceiveMoneyModalOpen, setReceiveMoneyModalOpen, user } = useStore();
  const [copied, setCopied] = useState<string | null>(null);
  const [rechargaCode, setRechargaCode] = useState<string>('');
  
  const { data: account, isLoading } = useQuery<Account>({
    queryKey: ['/api/account'],
    enabled: isReceiveMoneyModalOpen,
  });

  // Generar un código de 3 letras y 7 dígitos aleatorio
  const generateRechargaCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lettersCode = Array(3).fill(0).map(() => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
    const numbersCode = Array(7).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
    return `${lettersCode}-${numbersCode}`;
  };

  // Generar el código cuando se abre el modal
  useEffect(() => {
    if (isReceiveMoneyModalOpen) {
      setRechargaCode(generateRechargaCode());
    }
  }, [isReceiveMoneyModalOpen]);

  const handleRegenerateCode = () => {
    setRechargaCode(generateRechargaCode());
  };

  const handleShare = () => {
    // In a real app, this would use the Web Share API
    // For now, we'll just close the modal
    setReceiveMoneyModalOpen(false);
  };
  
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog open={isReceiveMoneyModalOpen} onOpenChange={setReceiveMoneyModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="bg-[#D50000] text-white p-4 rounded-t-lg">
          <DialogTitle className="text-center text-white">Recibir dinero</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <div className="mb-6">
            <p className="mb-4 text-center">Comparte estos datos para recibir transferencias:</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Banco</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Davivienda</p>
                  <button 
                    onClick={() => copyToClipboard('Davivienda', 'banco')}
                    className="text-[#D50000] hover:text-[#BF0000]"
                  >
                    {copied === 'banco' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Tipo de cuenta</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium">{account?.accountType || 'Cuenta de Ahorros'}</p>
                  <button 
                    onClick={() => copyToClipboard(account?.accountType || 'Cuenta de Ahorros', 'tipo')}
                    className="text-[#D50000] hover:text-[#BF0000]"
                  >
                    {copied === 'tipo' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Número de cuenta</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    {isLoading ? 'Cargando...' : account?.accountNumber}
                  </p>
                  <button 
                    onClick={() => copyToClipboard(account?.accountNumber || '', 'numero')}
                    className="text-[#D50000] hover:text-[#BF0000]"
                    disabled={isLoading}
                  >
                    {copied === 'numero' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Titular</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium">{user?.name || 'Usuario'}</p>
                  <button 
                    onClick={() => copyToClipboard(user?.name || 'Usuario', 'titular')}
                    className="text-[#D50000] hover:text-[#BF0000]"
                  >
                    {copied === 'titular' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Sección de código de recarga */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-center font-medium text-[#D50000] mb-2">Código de recarga</h3>
              <p className="text-sm text-gray-600 mb-3 text-center">
                Utiliza este código para recibir transferencias rápidas o recargarlo en punto de servicio.
              </p>
              
              <div className="flex justify-between items-center p-3 bg-white border border-dashed border-[#D50000] rounded-lg mb-3">
                <span className="text-xl font-bold tracking-wider">{rechargaCode}</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleRegenerateCode}
                    className="text-[#D50000] hover:text-[#BF0000] p-1"
                    title="Generar nuevo código"
                  >
                    <RefreshCcw size={18} />
                  </button>
                  <button 
                    onClick={() => copyToClipboard(rechargaCode, 'codigo')}
                    className="text-[#D50000] hover:text-[#BF0000] p-1"
                    title="Copiar código"
                  >
                    {copied === 'codigo' ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Este código es válido por 24 horas. Puedes generar uno nuevo en cualquier momento.
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={handleShare} className="bg-[#D50000] hover:bg-[#BF0000] text-white font-medium py-2 px-4 rounded transition duration-300">
                <Share className="w-4 h-4 mr-2" />
                <span>Compartir datos</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
