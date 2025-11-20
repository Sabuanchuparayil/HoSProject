import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePromotions } from '../contexts/PromotionsContext';
import { useFinancials } from '../contexts/FinancialsContext';
import { useNavigate, Link } from 'react-router-dom';
import { Order, ShippingAddress, CartItem, ShippingOption } from '../types';
import { calculateOrderTotals, processPayment } from '../services/financialService';
import { getShippingOptions, generateTrackingNumber } from '../services/logisticsService';
import { useLogistics } from '../contexts/LogisticsContext';
import { useTheme } from '../contexts/ThemeContext';

interface CheckoutPageProps {
    onAddOrder: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onAddOrder }) => {
    const { cartItems, clearCart, appliedPromotion } = useCart();
    const { user, updateUser } = useAuth();
    const { currency, getDisplayPrice } = useCurrency();
    const { recordPromotionUsage } = usePromotions();
    const { taxRates } = useFinancials();
    const navigate = useNavigate();
    const { carriers } = useLogistics();
    const { isB2BMode } = useTheme();
    
    const [isProcessing, setIsProcessing] = useState(false);

    // NEW: Check for split shipments
    const hasSplitShipment = useMemo(() => {
        if (cartItems.length < 2) return false;
        const fulfillmentModels = new Set(cartItems.map(item => item.fulfillmentModel));
        return fulfillmentModels.size > 1;
    }, [cartItems]);

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(() => {
        const initialAddress = user?.addresses?.find(a => a.isDefault);
        return {
            firstName: initialAddress?.firstName || user?.name.split(' ')[0] || '',
            lastName: initialAddress?.lastName || user?.name.split(' ').slice(1).join(' ') || '',
            addressLine1: initialAddress?.addressLine1 || '',
            city: initialAddress?.city || '',
            postalCode: initialAddress?.postalCode || '',
            country: initialAddress?.country || 'GB',
        };
    });
    
    const [email, setEmail] = useState(user?.email || '');
    const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
    const [gdprConsent, setGdprConsent] = useState(false);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(true);

    useEffect(() => {
        // Fetch shipping options when address country changes
        const fetchOptions = async () => {
            setIsCalculatingShipping(true);
            setSelectedShipping(null);
            const options = await getShippingOptions(shippingAddress, carriers);
            setShippingOptions(options);
            if (options.length > 0) {
                setSelectedShipping(options[0]); // Default to the first option
            }
            setIsCalculatingShipping(false);
        };
        fetchOptions();
    }, [shippingAddress.country, carriers]);
    
    const orderSummary = useMemo(() => {
        if (cartItems.length === 0) return null;
        return calculateOrderTotals(
            cartItems, 
            currency, 
            shippingAddress.country, 
            appliedPromotion, 
            selectedShipping?.cost,
            taxRates,
            isB2BMode
        );
    }, [cartItems, currency, shippingAddress.country, appliedPromotion, selectedShipping, taxRates, isB2BMode]);


    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingAddress(prev => ({...prev, [e.target.name]: e.target.value }));
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gdprConsent || !orderSummary || !selectedShipping) {
            alert("You must agree to the terms and select a shipping option to place an order.");
            return;
        }
        setIsProcessing(true);

        try {
            const paymentDetails = await processPayment(orderSummary.total, currency);

            const finalAddress: ShippingAddress = {
                ...shippingAddress,
                email: user ? user.email : email
            };

            const newOrder: Order = {
                id: `HOS-${Date.now()}`,
                date: new Date().toISOString(),
                items: cartItems,
                shippingAddress: finalAddress,
                paymentDetails: paymentDetails,
                currency,
                subtotal: orderSummary.subtotal,
                shippingCost: orderSummary.shippingCost,
                taxes: orderSummary.taxes,
                platformFee: orderSummary.platformFee,
                total: orderSummary.total,
                sellerPayout: orderSummary.sellerPayout,
                status: 'Processing',
                discountAmount: orderSummary.discountAmount,
                promoCode: appliedPromotion?.code,
                shippingMethod: selectedShipping.method,
                auditLog: [{
                    timestamp: new Date().toISOString(),
                    user: 'System',
                    previousStatus: 'Processing', // initial state
                    newStatus: 'Processing',
                    notes: 'Order created and payment received.'
                }],
            };

            onAddOrder(newOrder);

            if (appliedPromotion) {
                recordPromotionUsage(appliedPromotion.id);
            }

            // Award loyalty points
            if (user) {
                const pointsEarned = Math.floor(orderSummary.total);
                const updatedUser = { ...user, loyaltyPoints: user.loyaltyPoints + pointsEarned };
                await updateUser(updatedUser);
            }

            clearCart();
            navigate('/order-confirmation', { state: { order: newOrder } });

        } catch (error) {
            console.error("Payment failed", error);
            alert("There was an issue processing your payment. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto text-center py-16">
                <h1 className="text-2xl font-bold">Your cart is empty.</h1>
                <Link to="/" className="text-[--accent] hover:text-[--accent-hover] mt-4 inline-block">Continue Shopping</Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-cinzel font-bold text-[--text-primary] mb-8">Checkout</h1>
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[--bg-secondary] p-8 rounded-lg shadow-xl space-y-8">
                    {/* Shipping Information */}
                    <div>
                        <h2 className="text-2xl font-cinzel text-[--accent] mb-4">Shipping Information</h2>
                        {/* NEW: Split shipment notification */}
                        {hasSplitShipment && (
                            <div className="p-4 mb-4 bg-blue-900/50 border border-blue-500 rounded-lg text-sm text-blue-200">
                                <p><strong>Note:</strong> Your order contains items from multiple locations and will arrive in separate packages.</p>
                            </div>
                        )}
                        <div className="space-y-4">
                             {!user && (
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[--text-muted] mb-1">Email for order confirmation</label>
                                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2 text-[--text-primary]" />
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="text" name="firstName" placeholder="First Name" value={shippingAddress.firstName} onChange={handleAddressChange} required className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2 text-[--text-primary]" />
                                <input type="text" name="lastName" placeholder="Last Name" value={shippingAddress.lastName} onChange={handleAddressChange} required className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2 text-[--text-primary]" />
                                <input type="text" name="addressLine1" placeholder="Address" value={shippingAddress.addressLine1} onChange={handleAddressChange} required className="sm:col-span-2 w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2 text-[--text-primary]" />
                                <input type="text" name="city" placeholder="City" value={shippingAddress.city} onChange={handleAddressChange} required className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2 text-[--text-primary]" />
                                <input type="text" name="postalCode" placeholder="Postal Code" value={shippingAddress.postalCode} onChange={handleAddressChange} required className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2 text-[--text-primary]" />
                                 <select name="country" value={shippingAddress.country} onChange={handleAddressChange} className="sm:col-span-2 w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2 text-[--text-primary]">
                                    <option value="GB">United Kingdom</option>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Method */}
                    <div>
                        <h2 className="text-2xl font-cinzel text-[--accent] mb-4">Shipping Method</h2>
                        <div className="space-y-3">
                            {isCalculatingShipping ? (
                                <p className="text-[--text-muted]">Calculating shipping options...</p>
                            ) : shippingOptions.length > 0 ? (
                                shippingOptions.map(option => (
                                    <label key={`${option.carrierId}-${option.method}`} className={`flex justify-between items-center p-4 rounded-md border-2 cursor-pointer transition-all ${selectedShipping?.carrierId === option.carrierId && selectedShipping.method === option.method ? 'bg-[--accent]/10 border-[--accent]' : 'bg-[--bg-primary] border-[--border-color] hover:border-gray-500'}`}>
                                        <div className="flex items-center">
                                            <input type="radio" name="shippingOption" checked={selectedShipping?.carrierId === option.carrierId && selectedShipping.method === option.method} onChange={() => setSelectedShipping(option)} className="h-4 w-4 text-[--accent] focus:ring-[--accent] border-gray-500"/>
                                            <div className="ml-3">
                                                <p className="font-semibold text-[--text-primary]">{option.carrierName} - {option.method}</p>
                                                <p className="text-sm text-[--text-muted]">{option.estimatedDelivery}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-[--text-primary]">{getDisplayPrice({ [currency]: option.cost })}</p>
                                    </label>
                                ))
                            ) : (
                                <p className="text-red-400">No shipping options available for this address.</p>
                            )}
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div>
                        <h2 className="text-2xl font-cinzel text-[--accent] mb-4">Payment Information</h2>
                        <div className="bg-[--bg-primary] p-4 rounded-md border border-[--border-color]">
                            <p className="text-[--text-muted] text-center">[Payment provider integration placeholder, e.g., Stripe/PayPal]</p>
                            <p className="text-xs text-center text-gray-500 mt-2">A simulated payment will be processed.</p>
                        </div>
                    </div>
                </div>
                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-[--bg-secondary] p-6 rounded-lg shadow-xl sticky top-28">
                        <h2 className="text-2xl font-cinzel text-[--accent] mb-4">Order Summary</h2>
                        {orderSummary && (
                             <div className="border-t border-[--border-color] mt-4 pt-4 space-y-3">
                                <div className="flex justify-between items-baseline text-2xl font-bold">
                                    <span className="text-[--text-primary]">Total to Pay</span>
                                    <span className="text-[--accent]">{getDisplayPrice({ [currency]: orderSummary.total })}</span>
                                </div>
                                <p className="text-xs text-center text-[--text-muted] pt-2">Includes shipping and taxes. Full breakdown will be available after checkout.</p>
                            </div>
                        )}
                        <div className="mt-6 flex items-start">
                           <input id="gdpr-consent" name="gdpr-consent" type="checkbox" checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} className="h-4 w-4 mt-1 rounded border-gray-500 text-[--accent] focus:ring-[--accent]" />
                           <label htmlFor="gdpr-consent" className="ml-3 block text-sm text-[--text-muted]">
                             I agree to the processing of my personal data as described in the <Link to="/privacy" className="font-medium text-[--accent] hover:text-[--accent-hover]">Privacy Policy</Link>.
                           </label>
                        </div>
                        <button type="submit" disabled={!gdprConsent || !orderSummary || !selectedShipping || isCalculatingShipping || isProcessing} className="w-full mt-6 px-8 py-3 bg-[--accent] text-[--bg-primary] font-bold text-lg rounded-full hover:bg-[--accent-hover] transition disabled:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-60">
                            {isProcessing ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};