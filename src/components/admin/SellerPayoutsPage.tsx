import React from 'react';
import { Seller } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface SellerPayoutsPageProps {
    sellers: Seller[];
    onUpdateSeller: (seller: Seller) => void;
}

const StatusCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-[--bg-secondary] p-6 rounded-lg shadow-lg border border-[--border-color]">
        <div className="flex items-center gap-4">
            <span className="text-4xl">{icon}</span>
            <div>
                <h2 className="text-2xl font-bold font-cinzel text-[--accent]">{title}</h2>
                <div className="text-md text-[--text-muted] mt-1">{children}</div>
            </div>
        </div>
    </div>
);


export const SellerPayoutsPage: React.FC<SellerPayoutsPageProps> = ({ sellers, onUpdateSeller }) => {
    const { user } = useAuth();
    const seller = sellers.find(s => s.id === user?.id);

    const handleConnect = () => {
        if (!seller) return;
        // Simulate starting the Stripe Connect onboarding
        const updatedSeller: Seller = {
          ...seller,
          financials: {
            ...seller.financials,
            payoutProvider: 'stripe',
            payoutAccountId: `acct_mock_${Date.now()}`,
            kycStatus: 'pending',
          },
          payoutsEnabled: false,
        };
        onUpdateSeller(updatedSeller);
    };

     const handleSimulateVerification = () => {
        if (!seller) return;
        // Simulate a webhook from Stripe confirming verification
         const updatedSeller: Seller = {
          ...seller,
          financials: {
            ...seller.financials,
            kycStatus: 'verified',
          },
          payoutsEnabled: true,
        };
        onUpdateSeller(updatedSeller);
    };


    if (!seller) {
        return <p>Loading seller information...</p>;
    }

    const renderContent = () => {
        switch (seller.financials.kycStatus) {
            case 'not_started':
                return (
                    <StatusCard icon="🔗" title="Connect a Payout Account">
                        <p>To receive payments for your sales, you need to connect to our secure payment partner, Stripe. Stripe handles all payments, verification, and tax reporting.</p>
                        <button 
                            onClick={handleConnect}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition"
                        >
                            Connect with Stripe
                        </button>
                    </StatusCard>
                );
            case 'pending':
                return (
                    <StatusCard icon="⏳" title="Verification in Progress">
                        <p>Your account has been successfully connected to Stripe! They are currently reviewing your information. This process can take up to 2 business days.</p>
                        <p className="text-xs mt-2">No further action is needed from you at this time.</p>
                        {/* Demo-only button to accelerate the process */}
                        <button onClick={handleSimulateVerification} className="mt-2 text-xs text-gray-400 hover:underline">[Demo: Simulate Successful Verification]</button>
                    </StatusCard>
                );
            case 'action_required':
                 return (
                    <StatusCard icon="⚠️" title="Action Required">
                        <p>Stripe requires more information to complete your account verification. This could be due to an incorrect document upload or missing details.</p>
                        <a 
                            href="#" 
                            onClick={(e) => e.preventDefault()}
                            className="mt-4 inline-block px-6 py-2 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition"
                        >
                            Complete Profile on Stripe
                        </a>
                    </StatusCard>
                );
            case 'rejected':
                 return (
                    <StatusCard icon="❌" title="Verification Failed">
                        <p>Unfortunately, Stripe was unable to verify your account with the information provided. Payouts are currently disabled. Please contact support for assistance.</p>
                    </StatusCard>
                );
            case 'verified':
                return (
                    <StatusCard icon="✅" title="Payouts Active">
                        <p>Congratulations! Your account is fully verified, and payouts are enabled. Payouts of your available balance are processed automatically on the 1st of each month.</p>
                        <div className="text-sm mt-4 p-3 bg-[--bg-primary] rounded-md">
                            <p><strong>Provider:</strong> <span className="capitalize">{seller.financials.payoutProvider}</span></p>
                            <p><strong>Account ID:</strong> <span className="font-mono">{seller.financials.payoutAccountId}</span></p>
                            <p className="text-xs mt-2 text-[--text-muted]">Your annual 1099-K tax forms will be generated and distributed by Stripe.</p>
                        </div>
                    </StatusCard>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold font-cinzel text-[--text-primary] mb-2">Banking & Payouts</h1>
            <p className="text-[--text-muted] mb-8">Manage your connection to our payment provider to receive your earnings.</p>

            <div className="max-w-3xl">
                {renderContent()}
            </div>
        </div>
    );
};
