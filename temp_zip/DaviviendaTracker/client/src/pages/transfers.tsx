import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useStore } from '@/lib/store';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MessageCircleIcon, AlertCircle } from 'lucide-react';
import { Account } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TransfersPage = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('');
  const [concept, setConcept] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { data: account } = useQuery<Account>({
    queryKey: ['/api/account'],
  });
  
  const transferMutation = useMutation({
    mutationFn: async () => {
      if (!bank || !accountNumber || !accountType || !amount) {
        throw new Error('Por favor complete todos los campos requeridos');
      }
      
      const parsedAmount = parseFloat(amount.replace(/,/g, ''));
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Por favor ingrese un monto válido');
      }
      
      try {
        const res = await apiRequest('POST', '/api/transactions/transfer', {
          bank,
          recipientAccountNumber: accountNumber,
          accountType,
          amount: parsedAmount,
          description: concept || 'Transferencia'
        });
        
        // Verificar si la respuesta es exitosa (2xx)
        if (!res.ok) {
          const errorData = await res.json();
          if (errorData.error_code === "4004") {
            throw { 
              response: errorData,
              message: errorData.message || "No puede realizar transferencias. Cuenta bloqueada por retenciones pendientes."
            };
          }
          throw new Error(errorData.message || 'Error en la transferencia');
        }
        
        return res.json();
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/account'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({
        title: "Transferencia exitosa",
        description: `Se ha transferido ${parseFloat(amount).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} exitosamente.`,
      });
      setAmount('');
      setBank('');
      setAccountNumber('');
      setAccountType('');
      setConcept('');
      navigate('/home');
    },
    onError: (error: any) => {
      // Comprobar si el error contiene el código 4004 (cuenta bloqueada)
      if (error?.response?.error_code === "4004" || 
          (typeof error.message === 'string' && error.message.includes('4004'))) {
        setErrorCode("4004");
        setErrorMessage(error?.response?.message || "No puede realizar transferencias. Cuenta bloqueada por retenciones pendientes.");
      } else {
        toast({
          title: "Error en la transferencia",
          description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
          variant: "destructive",
        });
      }
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const handleTransfer = () => {
    setIsLoading(true);
    setErrorCode(null);
    setErrorMessage(null);
    transferMutation.mutate();
  };
  
  // Función para contactar a atención al cliente por WhatsApp
  const handleContactSupport = () => {
    // Número actualizado de WhatsApp para atención al cliente
    const phoneNumber = "+573181527700";
    // Mensaje predefinido con el código de error
    const message = "Hola, necesito ayuda con mi cuenta. Tengo un error #4004";
    // Crear la URL de WhatsApp con el número y mensaje
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, '_blank');
  };

  const bankOptions = [
    { value: "davivienda", label: "Davivienda" },
    { value: "bancolombia", label: "Bancolombia" },
    { value: "bbva", label: "BBVA Colombia" },
    { value: "occidente", label: "Banco de Occidente" },
    { value: "bogota", label: "Banco de Bogotá" },
    { value: "popular", label: "Banco Popular" },
    { value: "avvillas", label: "Banco AV Villas" },
    { value: "caja-social", label: "Banco Caja Social" },
    { value: "colpatria", label: "Scotiabank Colpatria" },
    { value: "falabella", label: "Banco Falabella" }
  ];

  const accountTypeOptions = [
    { value: "ahorros", label: "Cuenta de Ahorros" },
    { value: "corriente", label: "Cuenta Corriente" }
  ];

  return (
    <div className="flex flex-col h-full">
      {isLoading && <LoadingOverlay text="Procesando transferencia..." />}
      
      {/* Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/home')} 
            className="mr-2 text-white hover:bg-red-700 p-1 rounded"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Transferencias</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 bg-gray-100">
        {/* Error de cuenta bloqueada */}
        {errorCode === "4004" && (
          <Alert className="mb-4 border-yellow-500 bg-yellow-50">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <AlertDescription className="text-black font-medium">{errorMessage}</AlertDescription>
            </div>
            <div className="mt-3">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white flex items-center"
                onClick={handleContactSupport}
              >
                <MessageCircleIcon className="h-4 w-4 mr-2" />
                Contactar soporte
              </Button>
            </div>
          </Alert>
        )}
        
        {/* Alerta si la cuenta ya está bloqueada */}
        {account?.status === "BLOQUEADA" && !errorCode && (
          <Alert className="mb-4 border-yellow-500 bg-yellow-50">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <AlertDescription className="text-black font-medium">
                Su cuenta se encuentra bloqueada. No podrá realizar transferencias hasta resolver las retenciones pendientes.
              </AlertDescription>
            </div>
            <div className="mt-3">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white flex items-center"
                onClick={handleContactSupport}
              >
                <MessageCircleIcon className="h-4 w-4 mr-2" />
                Contactar soporte
              </Button>
            </div>
          </Alert>
        )}
        
        {/* Balance Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <p className="text-sm text-gray-600">Saldo disponible</p>
          <p className="text-2xl font-bold">
            {account ? `$${account.balance.toLocaleString('es-CO')}` : 'Cargando...'}
          </p>
        </div>
        
        {/* Transfer Form */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-medium mb-4 text-red-600">Transferir dinero</h3>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleTransfer(); }}>
            <div>
              <Label htmlFor="from-account" className="block text-sm font-medium text-gray-700 mb-1">
                De
              </Label>
              <Select disabled defaultValue="account">
                <SelectTrigger id="from-account">
                  <SelectValue placeholder="Seleccionar cuenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account">
                    {account ? `${account.accountType} **** ${account.accountNumber.slice(-4)}` : 'Cargando...'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Banco
              </Label>
              <Select value={bank} onValueChange={setBank} required>
                <SelectTrigger id="bank">
                  <SelectValue placeholder="Seleccionar banco" />
                </SelectTrigger>
                <SelectContent>
                  {bankOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de cuenta
              </Label>
              <Select value={accountType} onValueChange={setAccountType} required>
                <SelectTrigger id="account-type">
                  <SelectValue placeholder="Seleccionar tipo de cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="account-number" className="block text-sm font-medium text-gray-700 mb-1">
                Número de cuenta
              </Label>
              <Input
                id="account-number"
                type="text"
                className="w-full"
                placeholder="Ingrese el número de cuenta"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
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
                  className="w-full pl-8"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="concept" className="block text-sm font-medium text-gray-700 mb-1">
                Concepto (opcional)
              </Label>
              <Input
                id="concept"
                type="text"
                className="w-full"
                placeholder="Ej: Pago arriendo"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={!bank || !accountNumber || !accountType || !amount}
              >
                Transferir
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransfersPage;
