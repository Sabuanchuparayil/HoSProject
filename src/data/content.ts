import { HomePageContent } from '../types';

export const MOCK_HOME_PAGE_CONTENT: HomePageContent = {
    hero: {
        image: 'https://images.unsplash.com/photo-1608222351213-824141151691?q=80&w=1200',
        title: {
            en: 'Discover the Magic',
            es: 'Descubre la Magia',
        },
        subtitle: {
            en: 'Your gateway to the most enchanting merchandise from across the fandom universe.',
            es: 'Tu puerta de entrada a la mercancía más encantadora de todo el universo fandom.',
        }
    },
    featuredFandoms: [
        'Harry Potter',
        'Lord of the Rings',
        'Star Wars',
        'Game of Thrones',
    ],
    collections: [
        {
            id: 'coll-1',
            title: { en: 'New Arrivals', es: 'Nuevos Lanzamientos' },
            type: 'new-arrivals',
            productIds: [],
            order: 1,
        },
        {
            id: 'coll-2',
            title: { en: 'Top Sellers', es: 'Más Vendidos' },
            type: 'bestsellers',
            productIds: [],
            order: 2,
        },
         {
            id: 'coll-3',
            title: { en: 'Curated Collection', es: 'Colección Curada' },
            type: 'manual',
            productIds: [1, 5, 10],
            order: 3,
        },
    ]
};
