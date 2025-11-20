import React, { useMemo } from 'react';
import { Transaction, Order, Seller } from '../../types';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Link } from 'react-router-dom';

interface TransactionDetailModalProps {
    transaction: Transaction;
    allTransactions: Transaction[];
    allOrders: Order[];
    sellers: Seller[];
    onClose: () => void;
}

const DetailRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <p className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">{label}</p>
        <div className="text-sm text-[--text-primary] mt-1">{children}</div>
    </div>
);

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, allTransactions, allOrders, sellers, onClose }) => {
    const { formatPrice } = useCurrency();
    const seller = sellers.find(s => s.id === transaction.sellerId);

    const relatedItems = useMemo(() => {
        const orderId = transaction.referenceId;
        const sourceOrder = allOrders.find(o => o.id === orderId);

        let relatedTransactions: Transaction[] = [];
        if (sourceOrder) {
            // Find all transactions related to this order (sales, refunds)
            relatedTransactions = allTransactions
                .filter(t => t.referenceId === sourceOrder.id && t.id !== transaction.id)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }

        // Handle reversals
        let reversedTx: Transaction | undefined;
        let reversalTx: Transaction | undefined;
        if (transaction.description.startsWith('Reversal of')) {
            const originalId = transaction.referenceId;
            reversedTx = allTransactions.find(t => t.id === originalId);
        } else {
            reversalTx = allTransactions.find(t => t.referenceId === transaction.id && t.description.startsWith('Reversal of'));
        }

        return { sourceOrder, relatedTransactions, reversedTx, reversalTx };
    }, [transaction, allTransactions, allOrders]);

    const transactionFlow = [
        ...([relatedItems.reversedTx, transaction, relatedItems.reversalTx].filter(Boolean) as Transaction[]),
        ...relatedItems.relatedTransactions,
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold font-cinzel text-[--text-primary]">Transaction Audit Trail</h2>
                        <p className="text-sm font-mono text-[--text-muted]">{transaction.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                
                <div className="mt-6 flex-grow overflow-y-auto pr-4 -mr-4 space-y-6">
                    {/* Primary Transaction */}
                    <div className="bg-[--bg-primary] p-4 rounded-lg border border-[--accent]/30">
                        <h3 className="font-semibold text-[--accent] mb-4">Primary Transaction</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <DetailRow label="Amount">
                                <span className={`font-mono font-bold ${transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {transaction.amount >= 0 ? '+' : ''}{formatPrice(transaction.amount, transaction.currency)}
                                </span>
                            </DetailRow>
                            <DetailRow label="Type"><span className="font-semibold">{transaction.type}</span></DetailRow>
                            <DetailRow label="Date">{new Date(transaction.date).toLocaleString()}</DetailRow>
                            <DetailRow label="Seller">{seller?.name || 'N/A'}</DetailRow>
                            <DetailRow label="Processed By">{transaction.processedBy}</DetailRow>
                            <DetailRow label="Reference ID">{transaction.referenceId || 'N/A'}</DetailRow>
                            <div className="col-span-2 md:col-span-3">
                                <DetailRow label="Description"><p className="italic">"{transaction.description}"</p></DetailRow>
                            </div>
                        </div>
                    </div>

                    {/* Linked Items */}
                    {(relatedItems.sourceOrder || relatedItems.reversedTx) && (
                        <div className="bg-[--bg-primary] p-4 rounded-lg">
                            <h3 className="font-semibold text-[--accent] mb-4">Linked Items</h3>
                            {relatedItems.sourceOrder && (
                                <div className="flex justify-between items-center bg-[--bg-tertiary] p-3 rounded-md">
                                    <div>
                                        <p className="text-xs text-[--text-muted]">Source Order</p>
                                        <p className="font-semibold">{relatedItems.sourceOrder.id}</p>
                                        <p className="text-xs text-gray-400">{relatedItems.sourceOrder.shippingAddress.firstName} {relatedItems.sourceOrder.shippingAddress.lastName}</p>
                                    </div>
                                    <Link to={`/admin/orders/${relatedItems.sourceOrder.id}`} className="px-3 py-1 bg-[--bg-secondary] text-sm font-semibold rounded-full hover:bg-[--border-color]">View Order</Link>
                                </div>
                            )}
                             {relatedItems.reversedTx && (
                                <div className="mt-2 bg-[--bg-tertiary] p-3 rounded-md">
                                    <p className="text-xs text-[--text-muted]">Original Transaction (Reversed)</p>
                                    <p className="font-semibold">{relatedItems.reversedTx.id}</p>
                                    <p className="text-xs text-gray-400">{relatedItems.reversedTx.description}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Transaction Flow */}
                    <div className="bg-[--bg-primary] p-4 rounded-lg">
                        <h3 className="font-semibold text-[--accent] mb-4">Transaction Flow</h3>
                        <div className="space-y-4">
                            {transactionFlow.map((tx, index) => (
                                <div key={tx.id} className={`relative pl-8 border-l-2 ${tx.id === transaction.id ? 'border-[--accent]' : 'border-[--border-color]'}`}>
                                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${tx.id === transaction.id ? 'bg-[--accent] ring-4 ring-[--accent]/20' : 'bg-gray-600'}`}></div>
                                    <p className="font-semibold text-[--text-secondary]">{tx.type}</p>
                                    <p className={`text-sm font-mono ${tx.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {tx.amount >= 0 ? '+' : ''}{formatPrice(tx.amount, tx.currency)}
                                    </p>
                                    <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
