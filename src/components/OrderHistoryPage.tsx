import React from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { useAuth } from '../contexts/AuthContext';

interface OrderHistoryPageProps {
    orders: Order[];
}


export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ orders }) => {
    const { formatPrice } = useCurrency();
    const { user } = useAuth();
    
    // In a real app, orders would be fetched based on user ID.
    // For this demo, we assume all mock orders belong to the logged-in user.
    const userOrders = orders; 

    const getStatusClass = (status: Order['status']) => {
        if (status.includes('Delivered') || status.includes('Completed')) return 'bg-green-500/20 text-green-400';
        if (status.includes('Cancelled') || status.includes('Rejected')) return 'bg-red-500/20 text-red-400';
        if (status.includes('Shipped') || status.includes('Return')) return 'bg-blue-500/20 text-blue-300';
        return 'bg-yellow-500/20 text-yellow-400';
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-cinzel font-bold text-[--accent] mb-8">My Orders</h1>
            {userOrders.length === 0 ? (
                <div className="text-center bg-[--bg-secondary] p-8 rounded-lg">
                    <p className="text-[--text-muted] mb-4">You have not placed any orders yet.</p>
                     <Link to="/" className="px-6 py-2 bg-[--accent] text-[--bg-primary] font-bold rounded-full hover:bg-[--accent-hover] transition">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {userOrders.map(order => (
                        <div key={order.id} className="bg-[--bg-secondary] rounded-lg shadow-lg p-4 space-y-2">
                             <div className="flex justify-between items-center">
                                <p className="font-mono text-sm text-[--text-primary]">{order.id}</p>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>{order.status}</span>
                            </div>
                            <div className="border-b border-[--border-color] pb-2 text-sm text-[--text-muted]">
                                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <p className="font-bold text-lg text-[--text-primary]">{formatPrice(order.total, order.currency)}</p>
                                <Link to={`/orders/${order.id}`} className="px-4 py-1 bg-[--accent] text-[--accent-foreground] font-bold rounded-full text-sm">View Details</Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block bg-[--bg-secondary] rounded-lg shadow-xl overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[--bg-tertiary]">
                            <tr>
                                <th className="p-4 font-semibold text-[--text-secondary]">Order ID</th>
                                <th className="p-4 font-semibold text-[--text-secondary]">Date</th>
                                <th className="p-4 font-semibold text-[--text-secondary]">Status</th>
                                <th className="p-4 font-semibold text-[--text-secondary]">Total</th>
                                <th className="p-4 font-semibold text-[--text-secondary]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {userOrders.map(order => (
                                <tr key={order.id} className="border-b border-[--border-color] hover:bg-[--bg-tertiary]/50">
                                    <td className="p-4 font-mono text-[--text-primary]">{order.id}</td>
                                    <td className="p-4 text-[--text-muted]">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>{order.status}</span>
                                    </td>
                                    <td className="p-4 font-semibold text-[--text-primary]">{formatPrice(order.total, order.currency)}</td>
                                    <td className="p-4 text-right">
                                        <Link to={`/orders/${order.id}`} className="font-medium text-[--accent] hover:text-[--accent-hover]">View Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </>
            )}
        </div>
    );
};