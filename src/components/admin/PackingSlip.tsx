import React from 'react';
import { Order } from '../../types';

interface PackingSlipProps {
    order: Order;
}

export const PackingSlip: React.FC<PackingSlipProps> = ({ order }) => {
    // This component is designed to be rendered into a new window for printing.
    // It uses inline styles and basic HTML for maximum compatibility with printers.
    const styles = `
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #111; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2 { font-family: 'Times New Roman', serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header, .footer { text-align: center; margin-bottom: 20px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .text-right { text-align: right; }
        .font-mono { font-family: 'Courier New', Courier, monospace; }
    `;

    return (
        <html>
            <head>
                <title>Packing Slip - Order {order.id}</title>
                <style>{styles}</style>
            </head>
            <body>
                <div className="container">
                    <div className="header">
                        <h1>House of Spells</h1>
                        <h2>Packing Slip</h2>
                    </div>
                    
                    <div className="grid">
                        <div>
                            <strong>Order ID:</strong> <span className="font-mono">{order.id}</span><br/>
                            <strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}
                        </div>
                        <div className="text-right">
                            <strong>Ship To:</strong><br/>
                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br/>
                            {order.shippingAddress.addressLine1}<br/>
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br/>
                            {order.shippingAddress.country}
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map(item => (
                                <tr key={item.id}>
                                    <td className="font-mono">{item.sku}</td>
                                    <td>{item.name.en}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div className="footer" style={{ marginTop: '40px' }}>
                        <p>Thank you for your order!</p>
                    </div>
                </div>
            </body>
        </html>
    );
};