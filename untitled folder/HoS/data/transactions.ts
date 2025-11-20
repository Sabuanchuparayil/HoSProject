import { Transaction } from '../types';

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'txn_123abc',
        date: '2023-08-01T12:00:05Z',
        type: 'Sale',
        amount: 89.97, // subtotal
        currency: 'GBP',
        description: 'Sale from Order HOS-1672574400000',
        referenceId: 'HOS-1672574400000',
        sellerId: 2,
        processedBy: 'System',
    },
     {
        id: 'txn_fee_123abc',
        date: '2023-08-01T12:00:06Z',
        type: 'Fee',
        amount: -13.49, // platformFee.local
        currency: 'GBP',
        description: 'Platform Fee for Order HOS-1672574400000',
        referenceId: 'HOS-1672574400000',
        sellerId: 2,
        processedBy: 'System',
    },
    {
        id: 'txn_456def',
        date: '2023-09-10T15:30:05Z',
        type: 'Sale',
        amount: 15.99,
        currency: 'USD',
        description: 'Sale from Order HOS-1675252800000',
        referenceId: 'HOS-1675252800000',
        sellerId: 5,
        processedBy: 'System',
    },
    {
        id: 'txn_fee_456def',
        date: '2023-09-10T15:30:06Z',
        type: 'Fee',
        amount: -2.39, // platformFee.local
        currency: 'USD',
        description: 'Platform Fee for Order HOS-1675252800000',
        referenceId: 'HOS-1675252800000',
        sellerId: 5,
        processedBy: 'System',
    }
];
