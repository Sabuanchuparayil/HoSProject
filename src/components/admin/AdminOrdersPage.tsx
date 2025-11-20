import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../../types';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useAuth } from '../../contexts/AuthContext';

interface AdminOrdersPageProps {
    orders: Order[];
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ orders }) => {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();

  const filteredOrders = useMemo(() => {
    if (user?.role === 'seller') {
      return orders.filter(order => order.items.some(item => item.sellerId === user.id));
    }
    return orders;
  }, [orders, user]);

  const getStatusClass = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
      case 'Return Completed':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
      case 'Partially Shipped':
      case 'Awaiting Pickup':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
      case 'Awaiting Shipment':
      case 'Return Requested':
      case 'Return Approved':
      case 'Return Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
      case 'Return Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const noOrdersMessage = (
    <div className="text-center p-8 text-[--text-muted] bg-[--bg-secondary] rounded-lg">
      No orders found.
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold font-cinzel text-[--text-primary] mb-8">Manage Orders</h1>
      
      {/* Desktop Table View */}
      <div className="hidden md:block bg-[--bg-secondary] rounded-lg shadow-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[--bg-tertiary]">
            <tr>
              <th className="p-4 font-semibold text-[--text-secondary]">Order ID</th>
              <th className="p-4 font-semibold text-[--text-secondary]">Customer</th>
              <th className="p-4 font-semibold text-[--text-secondary]">Date</th>
              <th className="p-4 font-semibold text-[--text-secondary]">Status</th>
              <th className="p-4 font-semibold text-[--text-secondary]">Total</th>
              <th className="p-4 font-semibold text-[--text-secondary]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? filteredOrders.map(order => (
              <tr key={order.id} className="border-b border-[--border-color] hover:bg-[--bg-tertiary]">
                <td className="p-4 font-mono text-[--text-primary]">{order.id}</td>
                <td className="p-4 font-bold text-[--text-primary]">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</td>
                <td className="p-4 text-[--text-muted]">{new Date(order.date).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-[--text-primary]">{formatPrice(order.total, order.currency)}</td>
                <td className="p-4">
                  <Link to={`/admin/orders/${order.id}`} className="text-[--accent] hover:text-[--accent-hover]">Manage</Link>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="text-center p-8 text-[--text-muted]">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredOrders.length > 0 ? filteredOrders.map(order => (
          <div key={order.id} className="bg-[--bg-secondary] rounded-lg shadow-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-mono text-sm text-[--text-primary]">{order.id}</p>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>{order.status}</span>
            </div>
            <div className="border-b border-[--border-color] pb-2">
              <p className="font-semibold text-[--text-secondary]">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p className="text-sm text-[--text-muted]">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <p className="font-bold text-lg text-[--text-primary]">{formatPrice(order.total, order.currency)}</p>
              <Link to={`/admin/orders/${order.id}`} className="px-4 py-1 bg-[--accent] text-[--accent-foreground] font-bold rounded-full text-sm">Manage</Link>
            </div>
          </div>
        )) : noOrdersMessage}
      </div>
    </div>
  );
};
