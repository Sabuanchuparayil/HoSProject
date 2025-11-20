
import React from 'react';
import { Link } from 'react-router-dom';

export const ShippingPolicyPage: React.FC = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="max-w-4xl mx-auto bg-[--bg-secondary] p-8 rounded-lg shadow-xl">
      <h1 className="text-4xl font-cinzel font-bold text-[--accent] mb-6 text-center">Shipping Policy</h1>
      <div className="space-y-6 text-[--text-secondary] leading-relaxed">
        <div>
          <h2 className="text-2xl font-cinzel text-[--text-primary] mb-2">Order Processing</h2>
          <p>
            Orders are typically processed within 1-2 business days. During peak seasons or sales events, processing times may be slightly longer. You will receive a shipment confirmation email with tracking information once your order has been dispatched.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-cinzel text-[--text-primary] mb-2">Shipping Carriers & Methods</h2>
          <p>
            We partner with a variety of magical and mundane carriers to deliver your items safely and efficiently. Available options for your location will be displayed at checkout. Our partners include:
          </p>
          <ul className="list-disc list-inside mt-2 pl-4 text-[--text-muted]">
            <li>Royal Owl Mail (Standard & Express International)</li>
            <li>Floo Network Express (UK & EU Expedited)</li>
            <li>Knight Bus Couriers (UK Ground)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-cinzel text-[--text-primary] mb-2">Estimated Delivery Times</h2>
          <p>
            Delivery times are estimates and begin from the date of shipping, rather than the date of order.
          </p>
           <ul className="list-disc list-inside mt-2 pl-4 text-[--text-muted]">
            <li><strong>United Kingdom (UK):</strong> 1-4 business days</li>
            <li><strong>Europe (EU):</strong> 2-10 business days</li>
            <li><strong>North America (NA):</strong> 3-14 business days</li>
            <li><strong>Rest of World (ROW):</strong> 10-20 business days</li>
          </ul>
           <p className="mt-2 text-sm">
            Express options are available for faster delivery. Please note that we are not responsible for delays caused by customs, carrier issues, or magical interference.
          </p>
        </div>

        <div>
            <h2 className="text-2xl font-cinzel text-[--text-primary] mb-2">Shipping Costs</h2>
            <p>
                Shipping costs are calculated at checkout based on the weight of your items and the destination. We occasionally offer free shipping promotions, so keep an eye out!
            </p>
        </div>
         <div>
            <h2 className="text-2xl font-cinzel text-[--text-primary] mb-2">International Shipping</h2>
            <p>
                We ship globally! Please be aware that international orders may be subject to import duties, taxes, and customs processing fees, which are the responsibility of the recipient. We cannot predict what these charges may be.
            </p>
        </div>
         <div className="text-center pt-6">
          <Link to="/" className="px-8 py-3 bg-[--accent] text-[--bg-primary] font-bold text-lg rounded-full hover:bg-[--accent-hover] transition">
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  </div>
);
