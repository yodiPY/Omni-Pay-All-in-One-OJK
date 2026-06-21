import { Card, Transaction } from '../types';

export const DEMO_EMAIL = 'yodi@omnipay.app';
export const DEMO_PASSWORD = 'password123';

export const initialTransactions: Transaction[] = [
  {
    id: '1',
    name: 'Spotify',
    date: 'Dec 12',
    amount: -11.99,
    type: 'purchase',
    icon: 'musical-notes',
    iconColor: '#1DB954',
  },
  {
    id: '2',
    name: 'Received',
    date: 'Dec 12',
    amount: 150.0,
    type: 'received',
    icon: 'swap-horizontal',
    iconColor: '#3B82F6',
  },
  {
    id: '3',
    name: 'Chevron',
    date: 'Dec 11',
    amount: -50.0,
    type: 'bill',
    icon: 'car',
    iconColor: '#0066B2',
  },
  {
    id: '4',
    name: 'Whole Foods',
    date: 'Dec 10',
    amount: -87.32,
    type: 'purchase',
    icon: 'leaf',
    iconColor: '#2D6A4F',
  },
  {
    id: '5',
    name: 'Received',
    date: 'Dec 8',
    amount: 200.0,
    type: 'received',
    icon: 'swap-horizontal',
    iconColor: '#3B82F6',
  },
  {
    id: '6',
    name: 'Electric Bill',
    date: 'Dec 5',
    amount: -120.0,
    type: 'bill',
    icon: 'flash',
    iconColor: '#F59E0B',
  },
];

export const initialCards: Card[] = [
  {
    id: '1',
    brand: 'visa',
    lastFour: '4567',
    holder: 'Yodi Pratama',
    expiry: '09/27',
    variant: 'dark',
  },
  {
    id: '2',
    brand: 'mastercard',
    lastFour: '8901',
    holder: 'Yodi Pratama',
    expiry: '03/28',
    variant: 'gray',
  },
];

export const INITIAL_BALANCE = 2485.6;
