import { Promotion } from '../types';

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 1,
    code: 'WELCOME10',
    description: '10% off your first order',
    type: 'PERCENTAGE',
    value: 10,
    minSpend: 20,
    isActive: true,
    usageCount: 5,
    maxUsage: 100,
  },
  {
    id: 2,
    code: 'FREESHIP',
    description: 'Free standard shipping on orders over £50',
    type: 'FREE_SHIPPING',
    value: 0,
    minSpend: 50,
    isActive: true,
    usageCount: 22,
  },
  {
    id: 3,
    code: 'WANDSALE',
    description: '15% off all wands',
    type: 'PRODUCT_SPECIFIC_PERCENTAGE',
    value: 15,
    isActive: true,
    usageCount: 8,
    applicableCategory: 'Wands',
  },
    {
    id: 4,
    code: 'EXPIRED',
    description: 'An old, expired code',
    type: 'PERCENTAGE',
    value: 20,
    isActive: false,
    usageCount: 50,
  }
];
