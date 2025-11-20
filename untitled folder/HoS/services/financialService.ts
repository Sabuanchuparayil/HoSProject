import { CartItem, PaymentDetails, Promotion } from '../types';

// --- CONFIGURATION ---
const PLATFORM_FEE_RATE = 0.15; // 15% platform fee
const BASE_CURRENCY = 'GBP';

// In a real app, this would be a call to a live currency conversion API.
const MOCK_CONVERSION_RATES_TO_GBP: { [key: string]: number } = {
    'GBP': 1,
    'USD': 0.80, // 1 USD = 0.80 GBP
    'EUR': 0.85, // 1 EUR = 0.85 GBP
    'JPY': 0.005, // 1 JPY = 0.005 GBP
};

/**
 * Converts an amount from a source currency to the base currency (GBP).
 * @param amount The amount in the source currency.
 * @param sourceCurrency The three-letter code of the source currency.
 * @returns The converted amount in the base currency.
 */
const convertToBaseCurrency = (amount: number, sourceCurrency: string): number => {
    const rate = MOCK_CONVERSION_RATES_TO_GBP[sourceCurrency] || 1; // Default to 1 if currency is unknown
    return amount * rate;
};


/**
 * Calculates the complete financial breakdown for an order.
 * @param cartItems - The items in the shopping cart.
 * @param currency - The currency for the transaction.
 * @param shippingCountry - The two-letter country code for tax calculation.
 * @param appliedPromotion - An optional promotion to apply to the order.
 * @param shippingCost - The cost of shipping, determined externally.
 * @param taxRates - A map of country codes to tax rate numbers.
 * @param isB2BMode - Flag to determine if wholesale pricing should be used.
 * @returns An object with all financial details.
 */
export const calculateOrderTotals = (
    cartItems: CartItem[], 
    currency: string, 
    shippingCountry: string,
    appliedPromotion: Promotion | null,
    shippingCost: number | undefined,
    taxRates: { [countryCode: string]: number },
    isB2BMode: boolean
) => {
    let finalShippingCost = shippingCost ?? 0;

    // 1. Calculate Subtotal
    const subtotal = cartItems.reduce((total, item) => {
        const priceObject = isB2BMode && item.tradePrice ? item.tradePrice : item.pricing;
        const price = priceObject[currency] || 0;
        return total + (price * item.quantity);
    }, 0);

    // 2. Calculate Discount
    let discountAmount = 0;
    if (appliedPromotion && (!appliedPromotion.minSpend || subtotal >= appliedPromotion.minSpend)) {
        switch(appliedPromotion.type) {
            case 'PERCENTAGE':
                discountAmount = subtotal * (appliedPromotion.value / 100);
                break;
            case 'PRODUCT_SPECIFIC_PERCENTAGE':
                const applicableSubtotal = cartItems
                    // FIX: Use `item.taxonomy.subCategory` instead of `item.category`.
                    .filter(item => 
                        (appliedPromotion.applicableCategory && item.taxonomy.subCategory === appliedPromotion.applicableCategory) ||
                        (appliedPromotion.applicableProductIds && appliedPromotion.applicableProductIds.includes(item.id))
                    )
                    .reduce((total, item) => total + (item.pricing[currency] || 0) * item.quantity, 0);
                discountAmount = applicableSubtotal * (appliedPromotion.value / 100);
                break;
            case 'FIXED_AMOUNT':
                discountAmount = appliedPromotion.value;
                break;
            case 'FREE_SHIPPING':
                discountAmount = finalShippingCost;
                finalShippingCost = 0;
                break;
        }
    }
    // Ensure discount is not more than the subtotal
    discountAmount = Math.min(subtotal + finalShippingCost, discountAmount);
    
    const discountedSubtotal = subtotal - (appliedPromotion?.type === 'FREE_SHIPPING' ? 0 : discountAmount);

    // 3. Calculate Taxes (on discounted subtotal)
    const taxRate = taxRates[shippingCountry] || 0;
    const taxes = discountedSubtotal * taxRate;
    
    // 4. Calculate Platform Fee (on original subtotal) and convert to base currency
    const localPlatformFee = subtotal * PLATFORM_FEE_RATE;
    const platformFee = {
        local: localPlatformFee,
        base: convertToBaseCurrency(localPlatformFee, currency)
    };

    // 5. Calculate Final Total for Customer
    const total = discountedSubtotal + finalShippingCost + taxes;

    // 6. Calculate Seller Payout (based on original subtotal)
    const sellerPayout = subtotal - platformFee.local;

    return {
        subtotal,
        shippingCost: finalShippingCost,
        taxes,
        platformFee,
        total,
        sellerPayout,
        discountAmount
    };
};


/**
 * Simulates processing a payment through a payment gateway.
 * @param amount - The total amount to be charged.
 * @param currency - The currency of the transaction.
 * @returns A promise that resolves with mock payment details.
 */
export const processPayment = (amount: number, currency: string): Promise<PaymentDetails> => {
    console.log(`Simulating payment of ${amount.toFixed(2)} ${currency}...`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.05) { // 95% success rate
                console.log("Payment Successful!");
                resolve({
                    method: 'Simulated Card',
                    transactionId: `txn_${Date.now()}`
                });
            } else {
                console.error("Payment Failed!");
                reject(new Error("The payment processor declined the transaction."));
            }
        }, 1500); // Simulate network delay
    });
};
