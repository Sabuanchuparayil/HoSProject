import React, { useState, FormEvent } from 'react';

export interface FulfillmentData {
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string;
    shippingNotes?: string;
}

interface FulfillmentModalProps {
    onClose: () => void;
    onFulfill: (data: FulfillmentData) => void;
}

export const FulfillmentModal: React.FC<FulfillmentModalProps> = ({ onClose, onFulfill }) => {
    const [carrier, setCarrier] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingUrl, setTrackingUrl] = useState('');
    const [shippingNotes, setShippingNotes] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onFulfill({
            carrier,
            trackingNumber,
            trackingUrl,
            shippingNotes
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold font-cinzel text-[--text-primary] mb-6">Fulfill Order & Add Tracking</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="carrier" className="block text-sm font-medium text-[--text-muted]">Shipping Carrier</label>
                        <input
                            id="carrier"
                            type="text"
                            value={carrier}
                            onChange={e => setCarrier(e.target.value)}
                            required
                            placeholder="e.g., Royal Mail, FedEx"
                            className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"
                        />
                    </div>
                    <div>
                        <label htmlFor="trackingNumber" className="block text-sm font-medium text-[--text-muted]">Tracking Number</label>
                        <input
                            id="trackingNumber"
                            type="text"
                            value={trackingNumber}
                            onChange={e => setTrackingNumber(e.target.value)}
                            required
                            className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"
                        />
                    </div>
                     <div>
                        <label htmlFor="trackingUrl" className="block text-sm font-medium text-[--text-muted]">Tracking URL (Optional)</label>
                        <input
                            id="trackingUrl"
                            type="url"
                            value={trackingUrl}
                            onChange={e => setTrackingUrl(e.target.value)}
                            placeholder="e.g., https://www.royalmail.com/track-your-item#/"
                            className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"
                        />
                    </div>
                    <div>
                        <label htmlFor="shippingNotes" className="block text-sm font-medium text-[--text-muted]">Notes for Customer (Optional)</label>
                        <textarea
                            id="shippingNotes"
                            value={shippingNotes}
                            onChange={e => setShippingNotes(e.target.value)}
                            rows={3}
                            placeholder="e.g., Your order has been split into two packages."
                            className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color] transition-colors">Cancel</button>
                        <button type="submit" className="px-8 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">Confirm & Notify Customer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};