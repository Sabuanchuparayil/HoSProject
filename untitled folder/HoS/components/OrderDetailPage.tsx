import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order, CartItem as CartItemType, TrackingStatus, ReturnRequest, ReturnReasonCode } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTrackingInfo } from '../services/logisticsService';
import { ReturnRequestModal } from './ReturnRequestModal';

interface OrderDetailPageProps {
    orders: Order[];
    returnRequests: ReturnRequest[];
    onAddReturnRequest: (request: ReturnRequest) => void;
}

const TrackingInfo: React.FC<{ trackingNumber: string }> = ({ trackingNumber }) => {
    const [history, setHistory] = useState<TrackingStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTracking = async () => {
            setIsLoading(true);
            const data = await getTrackingInfo(trackingNumber);
            setHistory(data);
            setIsLoading(false);
        };
        fetchTracking();
    }, [trackingNumber]);

    if (isLoading) return <p className="text-gray-400">Loading tracking history...</p>;

    return (
        <div className="mt-4 space-y-4">
            {history.map((status, index) => (
                <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-[--accent] ring-4 ring-[--accent]/30' : 'bg-gray-600'}`}></div>
                        {index < history.length - 1 && <div className="w-0.5 flex-grow bg-gray-600"></div>}
                    </div>
                    <div>
                        <p className={`font-semibold ${index === 0 ? 'text-[--text-primary]' : 'text-gray-400'}`}>{status.status}</p>
                        <p className="text-sm text-gray-500">{status.location}</p>
                        <p className="text-xs text-gray-600">{new Date(status.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};


export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ orders, returnRequests, onAddReturnRequest }) => {
    const { id } = useParams<{ id: string }>();
    const { formatPrice } = useCurrency();
    const { t } = useLanguage();
    
    const order = orders.find(o => o.id === id);
    const existingReturn = returnRequests.find(r => r.orderId === id);
    const [showTracking, setShowTracking] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

    const isReturnable = order?.status === 'Delivered' && !existingReturn;
    
    const handleReturnSubmit = (requestData: {
        orderId: string;
        items: { productId: number; quantity: number }[];
        reasonCode: ReturnReasonCode;
        reasonDetail: string;
    }) => {
        const newRequest: ReturnRequest = {
            ...requestData,
            id: `RET-${requestData.orderId}-${Date.now()}`,
            status: 'Pending Approval',
            requestDate: new Date().toISOString()
        };
        onAddReturnRequest(newRequest);
    };

    if (!order) {
        return (
            <div className="container mx-auto text-center py-16">
                 <h1 className="text-2xl font-bold">Order not found.</h1>
                 <Link to="/orders" className="text-[--accent] hover:text-[--accent-hover] mt-4 inline-block">&larr; Back to all orders</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
              <Link to="/orders" className="text-[--accent] hover:text-[--accent-hover] inline-block">&larr; Back to all orders</Link>
              {isReturnable && (
                  <button onClick={() => setIsReturnModalOpen(true)} className="px-4 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color] transition-colors">
                      Request Return
                  </button>
              )}
            </div>

            <div className="bg-[--bg-secondary] rounded-lg shadow-xl p-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-cinzel font-bold text-[--text-primary]">Order <span className="font-mono">{order.id}</span></h1>
                        <p className="text-[--text-muted]">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{order.status.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>

                {order.shippingNotes && (
                    <div className="mb-6 p-4 bg-blue-900/50 border border-blue-500 rounded-lg">
                        <h3 className="font-semibold text-blue-300">A Note from the Seller</h3>
                        <p className="text-blue-200 italic">"{order.shippingNotes}"</p>
                    </div>
                )}
                
                {existingReturn && (
                    <div className="mb-6 p-4 bg-blue-900/50 border border-blue-500 rounded-lg">
                        <h3 className="font-semibold text-blue-300">Return Status</h3>
                        <p className="text-blue-200">A return for this order was requested on {new Date(existingReturn.requestDate).toLocaleDateString()}.</p>
                        <p>Current Status: <span className="font-bold">{existingReturn.status}</span></p>
                    </div>
                )}
                
                <div className="space-y-4 mb-8">
                    {order.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 border-b border-[--border-color]">
                            <div className="flex items-center gap-4">
                                <img src={item.media[0]?.url} alt={t(item.name)} className="w-16 h-16 object-cover rounded-md" />
                                <div>
                                    <h3 className="font-bold text-[--text-primary] text-lg">{t(item.name)}</h3>
                                    <p className="text-[--text-muted]">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-bold text-[--text-primary] text-right">{formatPrice((item.pricing[order.currency] || 0) * item.quantity, order.currency)}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[--border-color] pt-6">
                    {/* Left Column: Financial & Address */}
                    <div className="space-y-6">
                         <div>
                            <h3 className="font-semibold text-[--accent] mb-2">Order Summary</h3>
                            <div className="space-y-1 text-[--text-muted]">
                                <div className="flex justify-between"><span>Subtotal:</span> <span>{formatPrice(order.subtotal, order.currency)}</span></div>
                                {order.discountAmount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Discount ({order.promoCode}):</span>
                                        <span>- {formatPrice(order.discountAmount, order.currency)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between"><span>Shipping ({order.shippingMethod}):</span> <span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost, order.currency)}</span></div>
                                <div className="flex justify-between"><span>Taxes:</span> <span>{formatPrice(order.taxes, order.currency)}</span></div>
                                <div className="flex justify-between font-bold text-[--text-primary] border-t border-[--border-color] mt-1 pt-1"><span>Total:</span> <span>{formatPrice(order.total, order.currency)}</span></div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-[--accent] mb-2">Shipping Address</h3>
                            <p className="text-[--text-muted]">
                                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                                {order.shippingAddress.addressLine1}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                {order.shippingAddress.country}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[--accent] mb-2">Payment Method</h3>
                            <p className="text-[--text-muted]">{order.paymentDetails.method}</p>
                            <p className="text-xs text-gray-500">Ref: {order.paymentDetails.transactionId}</p>
                        </div>
                    </div>

                    {/* Right Column: Logistics */}
                    <div className="bg-[--bg-primary] p-6 rounded-lg">
                        <h3 className="text-xl font-cinzel font-semibold text-[--accent] mb-2">Logistics</h3>
                        <div className="space-y-3">
                             <div>
                                <span className="text-sm text-gray-400 block">Carrier</span>
                                <span className="font-semibold text-white">{order.carrier || 'Not yet shipped'}</span>
                            </div>
                             <div>
                                <span className="text-sm text-gray-400 block">Tracking Number</span>
                                {order.trackingNumber ? (
                                    order.trackingUrl ? (
                                        <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="font-mono font-semibold text-white hover:text-[--accent] underline">
                                            {order.trackingNumber}
                                        </a>
                                    ) : (
                                        <span className="font-mono font-semibold text-white">{order.trackingNumber}</span>
                                    )
                                ) : (
                                     <span className="font-mono font-semibold text-[--text-muted]">Not yet available</span>
                                )}
                            </div>
                            {order.trackingNumber && (
                                <button onClick={() => setShowTracking(!showTracking)} className="text-sm font-semibold text-yellow-400 hover:text-yellow-300">
                                    {showTracking ? 'Hide Tracking Details' : 'Show Tracking Details'}
                                </button>
                            )}
                             {showTracking && order.trackingNumber && <TrackingInfo trackingNumber={order.trackingNumber} />}
                        </div>
                    </div>
                </div>

            </div>
            {isReturnModalOpen && (
                <ReturnRequestModal 
                    order={order}
                    onClose={() => setIsReturnModalOpen(false)}
                    onSubmit={handleReturnSubmit}
                />
            )}
        </div>
    );
};