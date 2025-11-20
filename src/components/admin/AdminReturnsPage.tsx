

import React, { useState } from 'react';
import { ReturnRequest, Order } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { ReturnManagementModal } from './ReturnManagementModal';
import { RETURN_REASONS } from '../../data/reasons';

interface AdminReturnsPageProps {
    returnRequests: ReturnRequest[];
    orders: Order[];
    onUpdateReturnRequest: (updatedRequest: Partial<ReturnRequest> & { id: string }) => void;
}

export const AdminReturnsPage: React.FC<AdminReturnsPageProps> = ({ returnRequests, orders, onUpdateReturnRequest }) => {
    const { t } = useLanguage();
    const [managingRequest, setManagingRequest] = useState<ReturnRequest | null>(null);

    const getOrderById = (orderId: string) => orders.find(o => o.id === orderId);

    const getStatusClass = (status: ReturnRequest['status']) => {
        // FIX: The status values did not match the ReturnStatus type.
        // The logic now correctly categorizes the descriptive status strings.
        if (status.includes('Pending') || status === 'In Transit') {
            return 'bg-yellow-100 text-yellow-800';
        }
        if (status.includes('Approved') || status.includes('Completed')) {
            return 'bg-green-100 text-green-800';
        }
        if (status.includes('Rejected')) {
            return 'bg-red-100 text-red-800';
        }
        return 'bg-gray-100 text-gray-800';
    };

    const noReturnsMessage = (
        <div className="text-center p-8 text-[--text-muted] bg-[--bg-secondary] rounded-lg">
            No return requests found.
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold font-cinzel text-[--text-primary] mb-8">Manage Returns</h1>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
                {returnRequests.length === 0 ? noReturnsMessage : returnRequests.map(request => {
                    const order = getOrderById(request.orderId);
                    if (!order) return null;
                    const reason = RETURN_REASONS.find(r => r.code === request.reasonCode)?.description || request.reasonCode;
                    return (
                        <div key={request.id} className="bg-[--bg-secondary] rounded-lg shadow-lg p-4 space-y-2">
                             <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-mono text-sm text-[--text-primary]">{request.id}</p>
                                    <p className="text-xs text-[--text-muted]">Order: <span className="font-mono">{request.orderId}</span></p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClass(request.status)}`}>
                                    {request.status}
                                </span>
                            </div>
                            <div className="border-t border-[--border-color] pt-2 text-sm space-y-1">
                                <p className="font-semibold text-[--text-secondary]">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                <p className="text-[--text-muted]">Reason: <span className="font-semibold text-[--text-secondary]">{reason}</span></p>
                                <p className="text-xs text-gray-500">Requested: {new Date(request.requestDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex justify-end items-center pt-2 border-t border-[--border-color]">
                                <button onClick={() => setManagingRequest(request)} className="px-4 py-1 bg-[--accent] text-[--accent-foreground] font-bold rounded-full text-sm">
                                    Manage
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block bg-[--bg-secondary] rounded-lg shadow-xl overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[--bg-tertiary]">
                        <tr>
                            <th className="p-4 font-semibold text-[--text-secondary]">Return ID</th>
                            <th className="p-4 font-semibold text-[--text-secondary]">Order ID</th>
                            <th className="p-4 font-semibold text-[--text-secondary]">Customer</th>
                            <th className="p-4 font-semibold text-[--text-secondary]">Reason</th>
                            <th className="p-4 font-semibold text-[--text-secondary]">Status</th>
                            <th className="p-4 font-semibold text-[--text-secondary]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returnRequests.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center p-8 text-[--text-muted]">No return requests found.</td>
                            </tr>
                        )}
                        {returnRequests.map(request => {
                            const order = getOrderById(request.orderId);
                            if (!order) return null;
                             const reason = RETURN_REASONS.find(r => r.code === request.reasonCode)?.description || request.reasonCode;

                            return (
                                <tr key={request.id} className="border-b border-[--border-color] hover:bg-[--bg-tertiary]">
                                    <td className="p-4 font-mono text-[--text-primary]">{request.id}</td>
                                    <td className="p-4 font-mono text-[--text-muted]">{request.orderId}</td>
                                    <td className="p-4 font-semibold text-[--text-primary]">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</td>
                                    <td className="p-4 text-[--text-muted]">{reason}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClass(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => setManagingRequest(request)} className="text-[--accent] hover:text-[--accent-hover] font-semibold">
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {managingRequest && (
                <ReturnManagementModal
                    returnRequest={managingRequest}
                    order={getOrderById(managingRequest.orderId)!}
                    onClose={() => setManagingRequest(null)}
                    onUpdate={onUpdateReturnRequest}
                />
            )}
        </div>
    );
};
