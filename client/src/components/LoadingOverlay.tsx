import { useState, useEffect } from 'react';

interface LoadingOverlayProps {
  text?: string;
  isVisible?: boolean;
}

export const LoadingOverlay = ({ text = 'Procesando...', isVisible = false }: LoadingOverlayProps) => {
  const [visible, setVisible] = useState(isVisible);
  
  // For external control of visibility
  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 border-primary"></div>
        <p className="mt-4 text-primary font-medium">{text}</p>
      </div>
    </div>
  );
};

// Global loading control
let showLoadingFn: ((text?: string) => void) | null = null;
let hideLoadingFn: (() => void) | null = null;

export const registerLoadingFunctions = (
  showFn: (text?: string) => void, 
  hideFn: () => void
) => {
  showLoadingFn = showFn;
  hideLoadingFn = hideFn;
};

export const showLoading = (text?: string) => {
  if (showLoadingFn) showLoadingFn(text);
};

export const hideLoading = () => {
  if (hideLoadingFn) hideLoadingFn();
};
