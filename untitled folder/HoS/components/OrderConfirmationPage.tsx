import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Order } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { useLanguage } from '../contexts/LanguageContext';

export const OrderConfirmationPage: React.FC = () => {
    const location = useLocation();
    const order = location.state?.order as Order | undefined;
    const { getDisplayPrice, formatPrice } = useCurrency();
    const { t } = useLanguage();

    if (!order) {
        return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-4xl font-cinzel font-bold text-red-500 mb-4">Oops! Something went wrong.</h1>
                <p className="text-[--text-muted] mb-8">We couldn't retrieve your order details. Please check your order history.</p>
                 <Link to="/" className="px-8 py-3 bg-[--accent] text-[--bg-primary] font-bold text-lg rounded-full hover:bg-[--accent-hover] transition">
                    Continue Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto bg-[--bg-secondary] rounded-lg shadow-2xl p-8">
                <div className="text-center">
                    <h1 className="text-4xl font-cinzel font-bold text-[--accent] mb-4">Thank You For Your Order!</h1>
                    <p className="text-[--text-muted] mb-2">Your order has been placed successfully and is being processed.</p>
                    <p className="text-[--text-muted] mb-8">Your Order ID is: <span className="font-bold text-[--text-primary] font-mono">{order.id}</span></p>
                </div>
                
                <div className="border-t border-[--border-color] mt-6 pt-6">
                    <h2 className="text-2xl font-cinzel text-[--text-primary] mb-4">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                        {order.items.map(item => (
                             <div key={item.id} className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <img src={item.media[0]?.url} alt={t(item.name)} className="w-16 h-16 object-cover rounded-md border border-[--border-color]"/>
                                    <div>
                                        <p className="font-semibold text-[--text-secondary]">{t(item.name)}</p>
                                        <p className="text-sm text-[--text-muted]">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="text-[--text-primary] font-semibold">{formatPrice(item.pricing[order.currency] * item.quantity, order.currency)}</span>
                            </div>
                        ))}
                    </div>
                     <div className="border-t border-[--border-color] mt-4 pt-4 space-y-2">
                        <div className="flex justify-between"><span className="text-[--text-muted]">Subtotal</span><span>{formatPrice(order.subtotal, order.currency)}</span></div>
                        {order.discountAmount > 0 && (
                            <div className="flex justify-between text-green-400">
                                <span className="text-[--text-muted]">Discount ({order.promoCode})</span>
                                <span>- {formatPrice(order.discountAmount, order.currency)}</span>
                            </div>
                        )}
                        <div className="flex justify-between"><span className="text-[--text-muted]">Shipping</span><span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost, order.currency)}</span></div>
                        <div className="flex justify-between"><span className="text-[--text-muted]">Taxes</span><span>{formatPrice(order.taxes, order.currency)}</span></div>
                        <div className="flex justify-between text-xl font-bold"><span className="text-[--text-primary]">Total</span><span>{formatPrice(order.total, order.currency)}</span></div>
                    </div>
                </div>

                 <div className="border-t border-[--border-color] mt-6 pt-6">
                    <h3 className="font-semibold text-[--accent] mb-2">Shipping to:</h3>
                    <p className="text-[--text-muted]">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br/>
                        {order.shippingAddress.addressLine1}<br/>
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br/>
                        {order.shippingAddress.country}
                    </p>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/" className="px-8 py-3 bg-[--accent] text-[--bg-primary] font-bold text-lg rounded-full hover:bg-[--accent-hover] transition text-center">
                        Continue Shopping
                    </Link>
                    <Link to="/orders" className="px-8 py-3 bg-transparent border-2 border-[--accent] text-[--accent] font-bold text-lg rounded-full hover:bg-[--accent] hover:text-[--bg-primary] transition text-center">
                        View My Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};
