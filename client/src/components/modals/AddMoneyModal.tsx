import { useStore } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Building2, ShoppingBag, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { LoadingOverlay } from '@/components/LoadingOverlay';

export const AddMoneyModal = () => {
  const { isAddMoneyModalOpen, setAddMoneyModalOpen } = useStore();
  const { toast } = useToast();
  const [showLoading, setShowLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  
  const depositMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMethod || !amount) {
        throw new Error('Por favor seleccione un método y un monto');
      }
      
      const res = await apiRequest('POST', '/api/transactions/deposit', {
        amount,
        method: selectedMethod
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/account'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      setAddMoneyModalOpen(false);
      toast({
        title: "Depósito exitoso",
        description: `Se han agregado ${amount?.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} a tu cuenta.`,
      });
      setSelectedMethod(null);
      setAmount(null);
    },
    onError: (error) => {
      toast({
        title: "Error al recargar",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      });
    }
  });

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    // In a real app, this would show a form for the selected method
    setAmount(100000); // Default amount for demo
    handleDeposit(method);
  };
  
  const handleDeposit = (method: string) => {
    setShowLoading(true);
    depositMutation.mutate();
  };

  return (
    <>
      {showLoading && <LoadingOverlay text="Procesando recarga..." />}
      <Dialog open={isAddMoneyModalOpen} onOpenChange={setAddMoneyModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="bg-[#D50000] text-white p-4 rounded-t-lg">
            <DialogTitle className="text-center text-white">Recargar cuenta</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="mb-6">
              <h4 className="font-medium mb-4 text-center">Selecciona un método de recarga</h4>
              <div className="space-y-3">
                <div 
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => handleMethodSelect('Tarjeta de crédito')}
                >
                  <div className="flex items-center">
                    <CreditCard className="text-[#D50000] mr-3 h-5 w-5" />
                    <span>Tarjeta de crédito</span>
                  </div>
                  <ChevronRight className="text-gray-400 h-5 w-5" />
                </div>
                
                <div 
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => handleMethodSelect('Transferencia bancaria')}
                >
                  <div className="flex items-center">
                    <Building2 className="text-[#D50000] mr-3 h-5 w-5" />
                    <span>Transferencia bancaria</span>
                  </div>
                  <ChevronRight className="text-gray-400 h-5 w-5" />
                </div>
                
                <div 
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => handleMethodSelect('Puntos de recarga')}
                >
                  <div className="flex items-center">
                    <ShoppingBag className="text-[#D50000] mr-3 h-5 w-5" />
                    <span>Puntos de recarga</span>
                  </div>
                  <ChevronRight className="text-gray-400 h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
