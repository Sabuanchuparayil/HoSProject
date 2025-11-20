
import React from 'react';
import { Link } from 'react-router-dom';

export const ReturnsPolicyPage: React.FC = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="max-w-4xl mx-auto bg-[--bg-secondary] p-8 rounded-lg shadow-xl">
      <h1 className="text-4xl font-cinzel font-bold text-[--accent] mb-6 text-center">Returns & Exchanges</h1>
      <div className="space-y-6 text-[--text-secondary] leading-relaxed">
        <div>
          <h2 className="text-2xl font-cinzel text-[--text-primary] mb-2">Our Promise</h2>
          <p>
            We want you to be completely satisfied with your magical purchase. If for any reason you are not, we are happy to accept returns on most items within 30 days of delivery.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-cinzel text-[--text-primary] mb-2">Conditions for Return</h2>
          <p>
            To be eligible for a return, your item must be:
          </p>
          <ul className="list-disc list-inside mt-2 pl-4 text-[--text-muted]">
            <li>Unused and in the same condition that you received it.</li>
            <li>In its original packaging with all tags attached.</li>
            <li>Returned within 30 days of the delivery date.</li>
          </ul>
          <p className="mt-2 text-sm">
            Please note that some items, such as personalized goods or consumable products (like potions or candy), are not eligible for return.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-cinzel text-[--text-primary] mb-2">How to Initiate a Return</h2>
           <ol className="list-decimal list-inside mt-2 pl-4 space-y-2 text-[--text-muted]">
              <li>Log into your account and navigate to your <Link to="/orders" className="text-[--accent] hover:underline font-semibold">Order History</Link>.</li>
              <li>Find the order containing the item(s) you wish to return and click "View Details".</li>
              <li>If the order is eligible, a "Request Return" button will be visible. Click it to start the process.</li>
              <li>Follow the on-screen instructions to select the items, reason for return, and your desired resolution (refund, exchange, etc.).</li>
              <li>Once submitted, our team will review your request and provide you with further instructions.</li>
          </ol>
        </div>

        <div>
            <h2 className="text-2xl font-cinzel text-[--text-primary] mb-2">Refunds</h2>
            <p>
                Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. If your return is approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.
            </p>
        </div>
         <div className="text-center pt-6">
          <Link to="/contact" className="px-8 py-3 bg-[--accent] text-[--bg-primary] font-bold text-lg rounded-full hover:bg-[--accent-hover] transition">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  </div>
);
