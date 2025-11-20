import { ProductReview } from '../types';

export const MOCK_REVIEWS: ProductReview[] = [
  {
    id: 1,
    productId: 1,
    userId: 3,
    userName: 'Harry Potter',
    rating: 5,
    comment: "It's surprisingly powerful. Almost feels like the real thing. Be careful with it!",
    date: '2023-08-10T14:20:00Z',
    isVerifiedPurchase: true,
  },
  {
    id: 2,
    productId: 1,
    userId: 1,
    userName: 'Albus Dumbledore',
    rating: 5,
    comment: 'A formidable wand, indeed. It has seen much history.',
    date: '2023-08-11T18:00:00Z',
    isVerifiedPurchase: false, // Admin review
  },
  {
    id: 3,
    productId: 5,
    userId: 3,
    userName: 'Harry Potter',
    rating: 4,
    comment: "Great replica! It doesn't fly, which is probably for the best. Looks fantastic on my shelf.",
    date: '2023-08-12T11:00:00Z',
    isVerifiedPurchase: true,
  },
];
