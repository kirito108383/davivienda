import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { es } from "date-fns/locale";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatToLocaleMonth(month: number, year: number): string {
  const date = new Date(year, month, 1);
  return format(date, 'MMMM yyyy', { locale: es });
}

export function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber || accountNumber.length < 4) return '****';
  return `**** ${accountNumber.slice(-4)}`;
}

export function getTransactionIcon(type: string, description: string = '') {
  // Logic to determine appropriate icon based on transaction type and description
  return 'swap_horiz'; // Default icon
}

export function formatDateTime(isoDate: string, showTime: boolean = true): string {
  const date = new Date(isoDate);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday && showTime) {
    return `Hoy, ${format(date, 'h:mm a', { locale: es })}`;
  } else if (showTime) {
    return format(date, "d MMM, h:mm a", { locale: es });
  } else {
    return format(date, "d MMM yyyy", { locale: es });
  }
}
