import { useLocation } from 'wouter';
import { useStore } from '@/lib/store';
import { SquareSplitHorizontal, ArrowDown, Banknote, Plus, CreditCard, MoreHorizontal } from 'lucide-react';

const QuickActions = () => {
  const [_, navigate] = useLocation();
  const { 
    setReceiveMoneyModalOpen, 
    setAddMoneyModalOpen, 
    setWithdrawMoneyModalOpen 
  } = useStore();

  const handleNavigateToTransfers = () => {
    navigate('/transfers');
  };

  const handleNavigateToPayments = () => {
    navigate('/payments');
  };

  const handleReceiveMoney = () => {
    setReceiveMoneyModalOpen(true);
  };

  const handleAddMoney = () => {
    setAddMoneyModalOpen(true);
  };

  const handleWithdrawMoney = () => {
    setWithdrawMoneyModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="font-medium mb-4">Acciones rápidas</h3>
      <div className="grid grid-cols-3 gap-2">
        <button 
          className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg"
          onClick={handleNavigateToTransfers}
        >
          <div className="w-10 h-10 rounded-full service-icon flex items-center justify-center mb-2">
            <SquareSplitHorizontal className="text-primary" size={20} />
          </div>
          <span className="text-xs text-center">Transferir</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg"
          onClick={handleReceiveMoney}
        >
          <div className="w-10 h-10 rounded-full service-icon flex items-center justify-center mb-2">
            <ArrowDown className="text-primary" size={20} />
          </div>
          <span className="text-xs text-center">Recibir</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg"
          onClick={handleWithdrawMoney}
        >
          <div className="w-10 h-10 rounded-full service-icon flex items-center justify-center mb-2">
            <Banknote className="text-primary" size={20} />
          </div>
          <span className="text-xs text-center">Retirar</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg"
          onClick={handleAddMoney}
        >
          <div className="w-10 h-10 rounded-full service-icon flex items-center justify-center mb-2">
            <Plus className="text-primary" size={20} />
          </div>
          <span className="text-xs text-center">Recargar</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg"
          onClick={handleNavigateToPayments}
        >
          <div className="w-10 h-10 rounded-full service-icon flex items-center justify-center mb-2">
            <CreditCard className="text-primary" size={20} />
          </div>
          <span className="text-xs text-center">Pagar</span>
        </button>
        
        <button className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded-full service-icon flex items-center justify-center mb-2">
            <MoreHorizontal className="text-primary" size={20} />
          </div>
          <span className="text-xs text-center">Más</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
