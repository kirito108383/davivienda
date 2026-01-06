import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useStore } from '@/lib/store';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { 
  Lightbulb, 
  Droplets, 
  Phone, 
  Wifi, 
  Tv, 
  MoreHorizontal,
  ArrowLeft 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Account, Service } from '@/types';

const PaymentsPage = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('electricity');
  const [selectedService, setSelectedService] = useState('');
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: account } = useQuery<Account>({
    queryKey: ['/api/account'],
  });
  
  const { data: services } = useQuery<Service[]>({
    queryKey: ['/api/services', { category: selectedCategory }],
    queryFn: async ({ queryKey }) => {
      // Siempre usaremos selectedCategory para asegurar que sea una variable definida
      const res = await fetch(`/api/services?category=${selectedCategory}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('No se pudieron cargar los servicios');
      return res.json();
    },
  });
  
  const paymentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedService || !reference || !amount) {
        throw new Error('Todos los campos son requeridos');
      }
      
      const parsedAmount = parseFloat(amount.replace(/,/g, ''));
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Por favor ingrese un monto válido');
      }
      
      const res = await apiRequest('POST', '/api/transactions/payment', {
        serviceId: parseInt(selectedService),
        reference,
        amount: parsedAmount
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/account'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({
        title: "Pago exitoso",
        description: `Se ha pagado ${parseFloat(amount).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} exitosamente.`,
      });
      setAmount('');
      setReference('');
      navigate('/home');
    },
    onError: (error) => {
      toast({
        title: "Error en el pago",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const handlePayment = () => {
    setIsLoading(true);
    paymentMutation.mutate();
  };
  
  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'electricity':
        return 'Electricidad';
      case 'water':
        return 'Agua';
      case 'phone':
        return 'Teléfono';
      case 'internet':
        return 'Internet';
      case 'tv':
        return 'TV';
      default:
        return 'Servicios';
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electricity':
        return <Lightbulb className="text-[#D50000]" size={20} />;
      case 'water':
        return <Droplets className="text-[#D50000]" size={20} />;
      case 'phone':
        return <Phone className="text-[#D50000]" size={20} />;
      case 'internet':
        return <Wifi className="text-[#D50000]" size={20} />;
      case 'tv':
        return <Tv className="text-[#D50000]" size={20} />;
      default:
        return <MoreHorizontal className="text-[#D50000]" size={20} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {isLoading && <LoadingOverlay text="Procesando pago..." />}
      
      {/* Header with back button */}
      <div className="mb-4">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center text-[#D50000] font-medium"
        >
          <ArrowLeft size={18} className="mr-1" /> Volver
        </button>
      </div>
      
      {/* Services Categories */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="font-medium mb-4 text-center">Pago de servicios</h3>
        <div className="grid grid-cols-3 gap-3">
          <button 
            className={`flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg ${selectedCategory === 'electricity' ? 'bg-gray-50 border border-[#D50000]' : ''}`}
            onClick={() => setSelectedCategory('electricity')}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <Lightbulb className="text-[#D50000]" size={22} />
            </div>
            <span className="text-xs text-center">Electricidad</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg ${selectedCategory === 'water' ? 'bg-gray-50 border border-[#D50000]' : ''}`}
            onClick={() => setSelectedCategory('water')}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <Droplets className="text-[#D50000]" size={22} />
            </div>
            <span className="text-xs text-center">Agua</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg ${selectedCategory === 'phone' ? 'bg-gray-50 border border-[#D50000]' : ''}`}
            onClick={() => setSelectedCategory('phone')}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <Phone className="text-[#D50000]" size={22} />
            </div>
            <span className="text-xs text-center">Teléfono</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg ${selectedCategory === 'internet' ? 'bg-gray-50 border border-[#D50000]' : ''}`}
            onClick={() => setSelectedCategory('internet')}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <Wifi className="text-[#D50000]" size={22} />
            </div>
            <span className="text-xs text-center">Internet</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg ${selectedCategory === 'tv' ? 'bg-gray-50 border border-[#D50000]' : ''}`}
            onClick={() => setSelectedCategory('tv')}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <Tv className="text-[#D50000]" size={22} />
            </div>
            <span className="text-xs text-center">TV</span>
          </button>
          
          <button 
            className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => {
              toast({
                title: "Más servicios",
                description: "Próximamente más servicios disponibles",
              });
            }}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <MoreHorizontal className="text-[#D50000]" size={22} />
            </div>
            <span className="text-xs text-center">Más</span>
          </button>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="bg-[#D50000] text-white p-4 rounded-t-lg">
          <h3 className="font-medium text-center">Pago de {getCategoryTitle()}</h3>
        </div>
        <div className="p-4">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
            <div>
              <Label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                Proveedor
              </Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger id="provider" className="border border-gray-200">
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {services && services.length > 0 ? (
                    services.map((service: Service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-service">No hay servicios disponibles</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                Número de referencia
              </Label>
              <Input
                id="reference"
                type="text"
                className="w-full border border-gray-200 focus:border-[#D50000] focus:ring-[#D50000]"
                placeholder="Ingrese número de cliente o referencia"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Monto
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <Input
                  id="amount"
                  type="text"
                  className="w-full pl-8 border border-gray-200 focus:border-[#D50000] focus:ring-[#D50000]"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta a debitar
              </Label>
              <Select disabled defaultValue="account">
                <SelectTrigger id="account" className="border border-gray-200">
                  <SelectValue placeholder="Seleccionar cuenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account">
                    {account ? `${account.accountType} **** ${account.accountNumber.slice(-4)}` : 'Cargando...'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-[#D50000] hover:bg-[#BF0000] text-white"
                disabled={!selectedService || !reference || !amount}
              >
                Pagar
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="bg-[#D50000] text-white p-3 rounded-t-lg">
          <h3 className="font-medium text-center">Pagos recientes</h3>
        </div>
        <div className="p-4">
          <div className="py-8 text-center text-gray-500">
            No hay pagos recientes
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
