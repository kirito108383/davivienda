import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/lib/store';
import { Plus } from 'lucide-react';
import { Beneficiary } from '@/types';

const BeneficiariesList = () => {
  const setBeneficiaries = useStore((state) => state.setBeneficiaries);
  
  const { data: beneficiaries, isLoading } = useQuery<Beneficiary[]>({
    queryKey: ['/api/beneficiaries'],
  });
  
  // Update store when data is loaded
  useEffect(() => {
    if (beneficiaries) {
      setBeneficiaries(beneficiaries);
    }
  }, [beneficiaries, setBeneficiaries]);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 1);
  };
  
  // Get shortened name
  const getShortenedName = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0]} ${parts[1].charAt(0)}.`;
    }
    return name;
  };

  if (isLoading) {
    return (
      <div className="flex space-x-4 overflow-x-auto pb-2">
        <div className="flex flex-col items-center min-w-[80px]">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="mt-2 w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-col items-center min-w-[80px]">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="mt-2 w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-4 overflow-x-auto pb-2">
      {beneficiaries && beneficiaries.map((beneficiary) => (
        <div key={beneficiary.id} className="flex flex-col items-center min-w-[80px]">
          <div className="w-12 h-12 bg-[#D50000] text-white rounded-full flex items-center justify-center mb-2">
            <span className="text-lg font-bold">{getInitials(beneficiary.name)}</span>
          </div>
          <span className="text-xs text-center">{getShortenedName(beneficiary.name)}</span>
        </div>
      ))}
      
      <div className="flex flex-col items-center min-w-[80px]">
        <div className="w-12 h-12 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center mb-2 cursor-pointer hover:bg-gray-300">
          <Plus className="w-5 h-5" />
        </div>
        <span className="text-xs text-center">Agregar</span>
      </div>
    </div>
  );
};

export default BeneficiariesList;
