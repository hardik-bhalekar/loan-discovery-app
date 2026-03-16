import { Home, GraduationCap, Car, Wallet } from 'lucide-react';

export const loanTypes = [
  {
    id: 'personal',
    name: 'Personal Loan',
    description: 'Unsecured loans for personal expenses like weddings, travel, medical emergencies, and more.',
    icon: Wallet,
    minAmount: 50000,
    maxAmount: 2500000,
    avgRate: '10.5%',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    id: 'home',
    name: 'Home Loan',
    description: 'Finance your dream home with competitive interest rates and long repayment tenures.',
    icon: Home,
    minAmount: 500000,
    maxAmount: 50000000,
    avgRate: '8.5%',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
  {
    id: 'education',
    name: 'Education Loan',
    description: 'Fund your higher education at top universities in India and abroad.',
    icon: GraduationCap,
    minAmount: 100000,
    maxAmount: 7500000,
    avgRate: '9.0%',
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  {
    id: 'vehicle',
    name: 'Vehicle Loan',
    description: 'Get on the road with affordable car and two-wheeler loan options.',
    icon: Car,
    minAmount: 100000,
    maxAmount: 10000000,
    avgRate: '9.5%',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
];

export default loanTypes;
