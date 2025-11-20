import { Order } from '../types';
import { MOCK_PRODUCTS } from './products';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'HOS-1672574400000',
    date: '2023-08-01T12:00:00Z',
    items: [
      { ...MOCK_PRODUCTS[0], quantity: 1 },
      { ...MOCK_PRODUCTS[1], quantity: 2 },
    ],
    shippingAddress: {
      firstName: 'Harry',
      lastName: 'Potter',
      email: 'customer@hogwarts.edu',
      addressLine1: '4 Privet Drive',
      city: 'Little Whinging',
      postalCode: 'KT23 6RL',
      country: 'GB',
    },
    paymentDetails: { method: 'Simulated Card', transactionId: 'txn_123abc' },
    currency: 'GBP',
    subtotal: 39.99 + (24.99 * 2),
    shippingCost: 5.99,
    taxes: (39.99 + (24.99 * 2)) * 0.2,
    platformFee: { local: (39.99 + (24.99 * 2)) * 0.15, base: (39.99 + (24.99 * 2)) * 0.15 },
    total: 39.99 + (24.99 * 2) + 5.99 + ((39.99 + (24.99 * 2)) * 0.2),
    discountAmount: 0,
    status: 'Delivered',
    sellerPayout: (39.99 + (24.99 * 2)) * 0.85,
    shippingMethod: 'Standard',
    carrier: 'Royal Owl Mail',
    trackingNumber: 'ROM-123456789',
    auditLog: [
        { timestamp: '2023-08-03T10:00:00Z', user: 'Admin', previousStatus: 'Shipped', newStatus: 'Delivered', notes: 'Package delivered.' },
        { timestamp: '2023-08-02T14:00:00Z', user: 'System', previousStatus: 'Awaiting Shipment', newStatus: 'Shipped', notes: 'Dispatched from warehouse.' },
        { timestamp: '2023-08-01T12:05:00Z', user: 'System', previousStatus: 'Processing', newStatus: 'Awaiting Shipment', notes: 'Payment confirmed.' },
    ],
  },
   {
    id: 'HOS-1675252800000',
    date: '2023-09-10T15:30:00Z',
    items: [
      { ...MOCK_PRODUCTS[2], quantity: 1 },
    ],
    shippingAddress: {
      firstName: 'Daenerys',
      lastName: 'Targaryen',
      email: 'dany@example.com',
      addressLine1: 'Great Pyramid',
      city: 'Meereen',
      postalCode: '12345',
      country: 'ROW', // Rest of World
    },
    paymentDetails: { method: 'Simulated PayPal', transactionId: 'txn_456def' },
    currency: 'USD',
    subtotal: 15.99,
    shippingCost: 10.00,
    taxes: 0, // No tax for ROW in this mock
    platformFee: { local: 15.99 * 0.15, base: (15.99 * 0.15) * 0.8 },
    total: 15.99 + 10.00,
    discountAmount: 0,
    status: 'Awaiting Shipment',
    sellerPayout: 15.99 * 0.85,
    shippingMethod: 'Express',
    auditLog: [{ timestamp: '2023-09-10T15:35:00Z', user: 'System', previousStatus: 'Processing', newStatus: 'Awaiting Shipment', notes: 'Payment confirmed.' }],
  },
];
