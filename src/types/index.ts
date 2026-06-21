export type TransactionType = 'sent' | 'received' | 'bill' | 'purchase';

export interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  type: TransactionType;
  icon: string;
  iconColor: string;
}

export interface Card {
  id: string;
  brand: 'visa' | 'mastercard';
  lastFour: string;
  holder: string;
  expiry: string;
  variant: 'dark' | 'gray';
}

export interface User {
  name: string;
  email: string;
  password: string;
  faceIdEnabled?: boolean;
  faceTemplate?: string;
}

export type FilterChip = 'All' | 'Sent' | 'Received' | 'Bills';
