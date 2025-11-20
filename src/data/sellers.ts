import { Seller } from '../types';

export const MOCK_SELLERS: Seller[] = [
  {
    id: 2,
    name: 'Ollivanders',
    theme: {
      name: 'ollivanders',
      customizations: {},
    },
    businessName: 'Ollivanders Wand Shop',
    contactEmail: 'contact@ollivanders.co.uk',
    businessAddress: { addressLine1: 'Diagon Alley', city: 'London', postalCode: 'W1', country: 'GB' },
    productCategories: ['Harry Potter', 'Fantastic Beasts'],
    status: 'approved',
    type: 'B2C',
    applicationDate: '2023-01-10T00:00:00Z',
    isVerified: true,
    payoutsEnabled: true,
    performance: { totalSales: 12500.50, averageRating: 4.8, activeListings: 15 },
    auditLog: [{ action: 'approved', admin: 'Dumbledore', timestamp: '2023-01-11T00:00:00Z' }],
    financials: {
      balance: { 'GBP': 1250.75, 'USD': 450.20 },
      payoutHistory: [],
      transactionLog: [],
      payoutProvider: 'stripe',
      payoutAccountId: 'acct_123456789',
      kycStatus: 'verified'
    },
    unlockedThemes: ['dark', 'light', 'ollivanders']
  },
  {
    id: 5,
    name: 'Borgin and Burkes',
    theme: {
      name: 'slytherin',
      customizations: {},
    },
    businessName: 'Borgin & Burkes Ltd.',
    contactEmail: 'shop@borginburkes.co.uk',
    businessAddress: { addressLine1: 'Knockturn Alley', city: 'London', postalCode: 'W1', country: 'GB' },
    productCategories: ['Harry Potter'],
    status: 'approved',
    type: 'B2C',
    applicationDate: '2023-03-01T00:00:00Z',
    isVerified: true,
    payoutsEnabled: true,
    performance: { totalSales: 8200.00, averageRating: 4.2, activeListings: 8 },
    auditLog: [{ action: 'approved', admin: 'Dumbledore', timestamp: '2023-03-02T00:00:00Z' }],
    financials: {
      balance: { 'GBP': 850.00 },
      payoutHistory: [],
      transactionLog: [],
      payoutProvider: 'stripe',
      payoutAccountId: 'acct_987654321',
      kycStatus: 'verified'
    },
    unlockedThemes: ['dark', 'light', 'slytherin']
  },
  {
    id: 6,
    name: 'Wizarding Wholesale',
    theme: {
      name: 'wholesale',
      customizations: {},
    },
    businessName: 'Wizarding Wholesale Inc.',
    contactEmail: 'sales@wiz-whole.com',
    businessAddress: { addressLine1: '123 Warehouse Row', city: 'Manchester', postalCode: 'M1', country: 'GB' },
    productCategories: ['Harry Potter', 'Marvel Cinematic Universe'],
    status: 'pending',
    type: 'Wholesale',
    applicationDate: '2023-05-20T00:00:00Z',
    isVerified: false,
    payoutsEnabled: false,
    performance: { totalSales: 0, averageRating: 0, activeListings: 0 },
    auditLog: [],
    financials: {
      balance: {},
      payoutHistory: [],
      transactionLog: [],
      payoutProvider: null,
      payoutAccountId: null,
      kycStatus: 'not_started'
    },
    unlockedThemes: ['dark', 'light', 'wholesale']
  },
];
