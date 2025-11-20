import { ProductWithTotalStock, Order, SellerAnalyticsData, BIInsight } from '../types';

/**
 * Filters orders to include only those containing at least one item from the specified seller.
 * @param sellerId - The ID of the seller.
 * @param orders - The list of all orders.
 * @returns An array of orders relevant to the seller.
 */
const getSellerOrders = (sellerId: number, orders: Order[]): Order[] => {
    return orders.filter(order => order.items.some(item => item.sellerId === sellerId));
};

/**
 * Generates comprehensive analytics for a specific seller.
 * @param sellerId - The ID of the seller to analyze.
 * @param allProducts - The list of all products in the store.
 * @param allOrders - The list of all orders in the store.
 * @returns A SellerAnalyticsData object.
 */
export const generateSellerAnalytics = (sellerId: number, allProducts: ProductWithTotalStock[], allOrders: Order[]): SellerAnalyticsData => {
    const sellerOrders = getSellerOrders(sellerId, allOrders);
    const sellerProducts = allProducts.filter(p => p.sellerId === sellerId);

    let totalRevenue = 0;
    let totalItemsSold = 0;
    const productSales: { [productId: number]: number } = {};

    sellerOrders.forEach(order => {
        order.items.forEach(item => {
            if (item.sellerId === sellerId) {
                const price = item.pricing[order.currency] || 0;
                // Note: In a real app, you'd convert currencies to a standard one (e.g., USD)
                totalRevenue += price * item.quantity;
                totalItemsSold += item.quantity;
                productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
            }
        });
    });

    const averageOrderValue = sellerOrders.length > 0 ? totalRevenue / sellerOrders.length : 0;
    
    const topSellingProducts = Object.entries(productSales)
        .map(([productId, unitsSold]) => {
            const product = sellerProducts.find(p => p.id === Number(productId));
            return { ...product, unitsSold };
        })
        .filter(p => p.id) // Filter out any potential mismatches
        .sort((a, b) => b.unitsSold - a.unitsSold)
        .slice(0, 5) as (ProductWithTotalStock & { unitsSold: number })[];

    // Mock sales data for the chart
    const salesByDay = [
        { name: 'Mon', sales: Math.random() * 500 },
        { name: 'Tue', sales: Math.random() * 500 },
        { name: 'Wed', sales: Math.random() * 500 },
        { name: 'Thu', sales: Math.random() * 500 },
        { name: 'Fri', sales: Math.random() * 500 },
        { name: 'Sat', sales: Math.random() * 500 },
        { name: 'Sun', sales: Math.random() * 500 },
    ];
    
    return {
        totalRevenue,
        totalItemsSold,
        averageOrderValue,
        topSellingProducts,
        salesByDay
    };
};


/**
 * Generates actionable business intelligence insights based on seller analytics.
 * @param analyticsData - The seller's analytics data.
 * @param currency - The user's active currency code.
 * @returns An array of BIInsight objects.
 */
export const generateBIInsights = (analyticsData: SellerAnalyticsData, currency: string): BIInsight[] => {
    const insights: BIInsight[] = [];
    
    // Insight 1: Low stock warning for top sellers
    analyticsData.topSellingProducts.forEach(product => {
        if (product.stock > 0 && product.stock <= 10) {
            insights.push({
                type: 'warning',
                message: `Your top-selling item, "${product.name.en}", is running low on stock (${product.stock} left). Consider restocking soon.`
            });
        }
         if (product.stock === 0) {
            insights.push({
                type: 'warning',
                message: `Your top-selling item, "${product.name.en}", is out of stock. Restock to avoid missing sales.`
            });
        }
    });

    // Insight 2: High AOV suggestion
    if (analyticsData.averageOrderValue > 50) {
         insights.push({
            type: 'suggestion',
            message: `Your average order value is high at ~${analyticsData.averageOrderValue.toFixed(2)} ${currency}. Consider adding a small, complementary item to encourage bundling.`
        });
    }

    // Insight 3: General info for new sellers
    if (analyticsData.totalItemsSold > 0 && analyticsData.totalItemsSold < 10) {
         insights.push({
            type: 'info',
            message: 'You\'ve made your first few sales! Keep adding new products to attract more customers.'
        });
    }
    
    if (insights.length === 0) {
        insights.push({
            type: 'info',
            message: 'Your dashboard is looking good. Keep an eye on your top sellers and stock levels!'
        });
    }

    return insights;
}
