import { Carrier } from '../types';

export const MOCK_CARRIERS: Carrier[] = [
  {
    id: 'owl-post',
    name: 'Royal Owl Mail',
    rates: [
      { method: 'Standard', zone: 'UK', cost: 5.99, estimatedDays: { min: 2, max: 4 } },
      { method: 'Express', zone: 'UK', cost: 9.99, estimatedDays: { min: 1, max: 1 } },
      { method: 'Standard', zone: 'ROW', cost: 15.99, estimatedDays: { min: 7, max: 14 } },
    ]
  },
  {
    id: 'knight-bus',
    name: 'Knight Bus Couriers',
    rates: [
      { method: 'Standard', zone: 'UK', cost: 4.50, estimatedDays: { min: 3, max: 5 } },
    ]
  },
];
