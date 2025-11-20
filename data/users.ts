import { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'Albus Dumbledore',
    email: 'admin@hogwarts.edu',
    password: 'password123',
    loyaltyPoints: 1000,
    role: 'admin',
    createdAt: '2023-01-01T10:00:00Z',
    addresses: [],
    phone: '123-456-7890',
  },
  {
    id: 2,
    name: 'Ollivander',
    email: 'seller@diagonalley.com',
    password: 'password123',
    loyaltyPoints: 50,
    role: 'seller',
    createdAt: '2023-02-15T11:00:00Z',
    addresses: [],
    phone: '123-456-7891',
  },
  {
    id: 3,
    name: 'Harry Potter',
    email: 'customer@hogwarts.edu',
    password: 'password123',
    loyaltyPoints: 150,
    role: 'customer',
    createdAt: '2023-03-20T12:00:00Z',
    addresses: [
      {
        id: 1,
        isDefault: true,
        firstName: 'Harry',
        lastName: 'Potter',
        addressLine1: 'The Cupboard Under the Stairs, 4 Privet Drive',
        city: 'Little Whinging',
        postalCode: 'KT23 6RL',
        country: 'GB'
      }
    ],
    phone: '123-456-7892',
  },
   {
    id: 4,
    name: 'Garrick Ollivander',
    email: 'ollivanders@example.com',
    password: 'password123',
    loyaltyPoints: 0,
    role: 'seller',
    createdAt: '2023-01-15T09:00:00Z',
    addresses: [],
  },
  {
    id: 5,
    name: 'Tom Riddle',
    email: 'borgin.burkes@example.com',
    password: 'password123',
    loyaltyPoints: 0,
    role: 'seller',
    createdAt: '2023-02-01T14:00:00Z',
    addresses: [],
  },
];
