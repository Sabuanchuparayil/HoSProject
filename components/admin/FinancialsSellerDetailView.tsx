import React, { useState, useMemo } from 'react';
import { Seller, Transaction } from '../../types';
import { useCurrency } from '../../contexts/CurrencyContext';

interface FinancialsSellerDetailViewProps {
    seller: Seller;
    onBack: () => void;
    onReverseTransaction: (tx: Transaction) => void;
    onViewDetails: (tx: Transaction) => void;
}

export const FinancialsSellerDetailView: React.FC<FinancialsSellerDetailViewProps> = ({ seller, onBack, onReverseTransaction, onViewDetails }) => {
    const { formatPrice } = useCurrency();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    const transactions = seller.financials.transactionLog;

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return transactions.slice(startIndex, startIndex + itemsPerPage);
    }, [transactions, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    const getTransactionTypeClass = (type: Transaction['type']) => {
        switch (type) {
          case 'Sale': return 'bg-green-100 text-green-800';
          case 'Payout': return 'bg-blue-100 text-blue-800';
          case 'Adjustment':
          case 'Fee': return 'bg-yellow-100 text-yellow-800';
          case 'Refund': return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    return (
        <div>
            <button onClick={onBack} className="text-[--accent] hover:text-[--accent-hover] mb-6 font-semibold">&larr; Back to All Sellers</button>
            <h2 className="text-3xl font-bold font-cinzel text-[--text-primary]">{seller.name}</h2>
            <p className="text-[--text-muted] mb-8">Financial statement and history.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Object.entries(seller.financials.balance).map(([currency, amount]) => (
                    <div key={currency} className="bg-[--bg-secondary] p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-[--text-muted]">{currency} Balance</h3>
                        <p className={`text-4xl font-bold ${(amount as number) > 0 ? 'text-green-500' : 'text-red-500'}`}>{formatPrice(amount as number, currency)}</p>
                    </div>
                ))}
                {Object.keys(seller.financials.balance).length === 0 && (
                    <div className="bg-[--bg-secondary] p-6 rounded-lg shadow-lg">
                         <h3 className="text-lg font-semibold text-[--text-muted]">Balance</h3>
                        <p className="text-4xl font-bold text-[--text-primary]">0.00</p>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[--bg-secondary] p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold font-cinzel text-[--accent] mb-4">Transaction History</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[--bg-tertiary]">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                             <tbody>
                                {paginatedTransactions.map(tx => (
                                    <tr key={tx.id} className="border-b border-[--border-color]">
                                        <td className="p-3 whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="p-3"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getTransactionTypeClass(tx.type)}`}>{tx.type}</span></td>
                                        <td className={`p-3 font-mono font-semibold ${tx.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>{tx.amount >= 0 ? '+' : ''}{formatPrice(tx.amount, tx.currency)}</td>
                                        <td className="p-3 text-[--text-muted] max-w-xs truncate">{tx.description}</td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => onViewDetails(tx)} className="text-xs text-blue-400 hover:underline">Details</button>
                                                {!tx.description.startsWith('Reversal of') && (tx.type === 'Adjustment' || tx.type === 'Fee' || tx.type === 'Refund') && (
                                                    <button onClick={() => onReverseTransaction(tx)} className="text-xs text-red-400 hover:underline">Reverse</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-[--text-muted]">Page {currentPage} of {totalPages}</span>
                        <div className="flex gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 bg-[--bg-tertiary] text-xs rounded disabled:opacity-50">Prev</button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 bg-[--bg-tertiary] text-xs rounded disabled:opacity-50">Next</button>
                        </div>
                    </div>
                </div>

                <div className="bg-[--bg-secondary] p-6 rounded-lg shadow-lg">
                     <h3 className="text-xl font-bold font-cinzel text-[--accent] mb-4">Payout History</h3>
                     <ul className="space-y-2">
                        {seller.financials.payoutHistory.length === 0 && <p className="text-sm text-[--text-muted]">No payouts have been processed.</p>}
                        {seller.financials.payoutHistory.map(payout => (
                            <li key={payout.transactionId} className="flex justify-between items-center bg-[--bg-tertiary] p-3 rounded">
                                <div>
                                    <p className="font-semibold">{formatPrice(payout.amount, payout.currency)}</p>
                                    <p className="text-xs text-[--text-muted]">{new Date(payout.date).toLocaleString()}</p>
                                </div>
                                <span className="text-xs font-mono text-blue-400">{payout.transactionId}</span>
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
        </div>
    );
};