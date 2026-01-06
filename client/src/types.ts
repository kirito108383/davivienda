// User types
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  lastLogin: string;
  isAdmin?: number;
}

export interface UserSession {
  id: number;
  userId: number;
  loginTime: string;
  logoutTime: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  sessionDuration: number | null;
}

// Account types
export interface Account {
  id: number;
  userId: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  status?: string;
  statusMessage?: string;
}

// Transaction types
export interface Transaction {
  id: number;
  accountId: number;
  amount: number;
  description: string;
  date: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  reference?: string;
  recipientId?: number | null;
}

// Beneficiary types
export interface Beneficiary {
  id: number;
  userId: number;
  name: string;
  bank: string;
  accountNumber: string;
  accountType: string;
}

// Service types
export interface Service {
  id: number;
  name: string;
  category: 'electricity' | 'water' | 'phone' | 'internet' | 'tv';
  description?: string;
}
