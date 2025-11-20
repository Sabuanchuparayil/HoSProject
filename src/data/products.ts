import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
    // Existing product from previous state
    {
        id: 1,
        name: { en: "The Elder Wand (Collector's Edition)", es: "La Varita de Saúco (Edición Coleccionista)" },
        description: { en: "An authentic hand-painted replica of the Elder Wand, as seen in the Harry Potter films. Comes in a collector's box.", es: "Una réplica auténtica pintada a mano de la Varita de Saúco, como se ve en las películas de Harry Potter. Viene en una caja de coleccionista." },
        pricing: { "GBP": 39.99, "USD": 49.99, "EUR": 45.99, "JPY": 7000 },
        rrp: { "GBP": 45.00, "USD": 55.00, "EUR": 50.00, "JPY": 7500 },
        tradePrice: { "GBP": 25.00, "USD": 30.00, "EUR": 28.00, "JPY": 4500 },
        media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1593344484962-796d9221915c?q=80&w=800' }],
        taxonomy: { fandom: "Harry Potter", subCategory: "Wands" },
        sku: "WAND-HP-ELDR-01-CE",
        barcode: "5055588636789",
        inventory: [{ centreId: 'main', name: 'Main Warehouse', stock: 15 }],
        sellerId: 2,
        hasVariations: false,
        fulfillmentModel: 'HoS Warehouse',
    },
    // More products
    {
        id: 5,
        name: { en: "Golden Snitch Replica", es: "Réplica de la Snitch Dorada" },
        description: { en: "A detailed, non-flying replica of the Golden Snitch. Perfect for display.", es: "Una réplica detallada y no voladora de la Snitch Dorada. Perfecta para exhibir." },
        pricing: { "GBP": 24.99, "USD": 29.99, "EUR": 27.99, "JPY": 4500 },
        media: [{ type: 'image', url: 'https://plus.unsplash.com/premium_photo-1669299699639-5e743637fe1a?q=80&w=800' }],
        taxonomy: { fandom: "Harry Potter", subCategory: "Collectibles" },
        sku: "COLL-HP-SNITCH-01",
        inventory: [{ centreId: 'main', name: 'Main Warehouse', stock: 50 }],
        sellerId: 2,
        hasVariations: false,
        fulfillmentModel: 'HoS Warehouse',
    },
     {
        id: 10,
        name: { en: "Hand of the King Pin", es: "Pin de la Mano del Rey" },
        description: { en: "A metal pin replica of the badge worn by the Hand of the King.", es: "Una réplica de metal de la insignia que lleva la Mano del Rey." },
        pricing: { "GBP": 12.99, "USD": 15.99, "EUR": 14.99, "JPY": 2200 },
        media: [{ type: 'image', url: 'https://plus.unsplash.com/premium_photo-1690481529188-5156641aa795?q=80&w=800' }],
        taxonomy: { fandom: "Game of Thrones", subCategory: "Jewelry" },
        sku: "JEWEL-GOT-HOTK-PIN",
        inventory: [{ centreId: 'main', name: 'Main Warehouse', stock: 200 }],
        sellerId: 5,
        fulfillmentModel: 'Seller Direct',
    },
    {
        id: 11,
        name: { en: "Gryffindor Scarf", es: "Bufanda de Gryffindor" },
        description: { en: "A high-quality, deluxe scarf in the colors and crest of Gryffindor house.", es: "Una bufanda de lujo de alta calidad con los colores y el escudo de la casa Gryffindor." },
        pricing: { "GBP": 29.95, "USD": 34.95, "EUR": 32.95, "JPY": 5000 },
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1606248897732-2b633999ea48?q=80&w=800' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1542861613-25f38538796d?q=80&w=800' }
        ],
        taxonomy: { fandom: "Harry Potter", subCategory: "Apparel" },
        sku: "APRL-HP-GRYF-SCRF",
        barcode: "5055588636796",
        inventory: [{ centreId: 'main', name: 'Main Warehouse', stock: 80 }],
        sellerId: 2,
        hasVariations: false,
        fulfillmentModel: 'HoS Warehouse',
    },
];
