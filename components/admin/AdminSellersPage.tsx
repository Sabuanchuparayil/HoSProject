import React, { useState, useMemo } from 'react';
import { Seller } from '../../types';
import { useCurrency } from '../../contexts/CurrencyContext';
import { SellerForm } from './SellerForm';
import { Link } from 'react-router-dom';

interface AdminSellersPageProps {
  sellers: Seller[];
  onUpdateSellerStatus: (sellerId: number, status: 'approved' | 'rejected') => void;
  onToggleSellerVerification: (sellerId: number) => void;
  onAddSeller: (sellerData: Pick<Seller, 'name' | 'businessName' | 'contactEmail' | 'type' | 'status'>) => void;
  onUpdateSeller: (seller: Seller) => void;
}

type SortConfig = {
  key: keyof Seller['performance'] | 'name';
  direction: 'ascending' | 'descending';
};

const PayoutStatusBadge: React.FC<{ status: Seller['financials']['kycStatus'] }> = ({ status }) => {
    const statusMap = {
        not_started: { text: 'Not Started', className: 'bg-gray-100 text-gray-800' },
        pending: { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
        verified: { text: 'Verified', className: 'bg-green-100 text-green-800' },
        action_required: { text: 'Action Required', className: 'bg-orange-100 text-orange-800' },
        rejected: { text: 'Rejected', className: 'bg-red-100 text-red-800' },
    };
    const { text, className } = statusMap[status] || statusMap.not_started;
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${className}`}>{text}</span>;
};


export const AdminSellersPage: React.FC<AdminSellersPageProps> = ({ sellers, onAddSeller, onUpdateSeller }) => {
  const { formatPrice } = useCurrency();
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | undefined>(undefined);

  const sortedAndFilteredSellers = useMemo(() => {
    let items = [...sellers];
    
    // Sorting
    if (sortConfig) {
      items.sort((a, b) => {
        const key = sortConfig.key;
        let aValue, bValue;

        if (key === 'name') {
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
        } else if (key === 'totalSales' || key === 'averageRating') {
          aValue = a.performance[key as keyof Seller['performance']];
          bValue = b.performance[key as keyof Seller['performance']];
        } else {
            return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    } else {
      // Default sort: pending first, then by application date
      items.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
      });
    }
    
    // Filtering
    return items
      .filter(seller => statusFilter === 'all' || seller.status === statusFilter)
      .filter(seller => typeFilter === 'all' || seller.type === typeFilter);

  }, [sellers, statusFilter, typeFilter, sortConfig]);
  
  const requestSort = (key: SortConfig['key']) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const SortableHeader: React.FC<{ label: string; sortKey: SortConfig['key'] }> = ({ label, sortKey }) => {
    const isSorted = sortConfig?.key === sortKey;
    const directionIcon = sortConfig?.direction === 'ascending' ? '▲' : '▼';
    return (
        <button onClick={() => requestSort(sortKey)} className="flex items-center gap-2 hover:text-[--accent] transition-colors text-[--text-secondary]">
            {label}
            <span className={isSorted ? 'text-[--accent]' : 'text-gray-400'}>
                {isSorted ? directionIcon : '↕'}
            </span>
        </button>
    )
  };

  const getStatusClass = (status: Seller['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const lastLogEntry = (seller: Seller) => {
    if (!seller.auditLog || seller.auditLog.length === 0) return 'N/A';
    const lastLog = seller.auditLog[seller.auditLog.length - 1];
    return `${lastLog.action.charAt(0).toUpperCase() + lastLog.action.slice(1)} by ${lastLog.admin}`;
  }

  const handleOpenModalForAdd = () => {
    setEditingSeller(undefined);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (seller: Seller) => {
    setEditingSeller(seller);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSeller(undefined);
  };

  const handleSaveSeller = (sellerData: Seller | Pick<Seller, 'name' | 'businessName' | 'contactEmail' | 'type' | 'status'>) => {
    if ('id' in sellerData) {
        onUpdateSeller(sellerData);
    } else {
        onAddSeller(sellerData as Pick<Seller, 'name' | 'businessName' | 'contactEmail' | 'type' | 'status'>);
    }
    handleCloseModal();
  };
  
  const VerifiedBadge = () => (
    <span className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full" title="Verified Seller">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Verified
    </span>
  );


  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold font-cinzel text-[--text-primary]">Seller Management</h1>
        <button
          onClick={handleOpenModalForAdd}
          className="w-full md:w-auto px-6 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300 transform hover:scale-105"
        >
          Add New Seller
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6 bg-[--bg-secondary] p-4 rounded-lg border border-[--border-color]">
        <span className="font-semibold text-[--text-secondary] flex-shrink-0">Filter by:</span>
        <div className="w-full sm:w-auto">
          <label htmlFor="statusFilter" className="sr-only">Status</label>
          <select id="statusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-[--text-primary] focus:ring-[--accent] focus:border-[--accent]">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label htmlFor="typeFilter" className="sr-only">Type</label>
          <select id="typeFilter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-[--text-primary] focus:ring-[--accent] focus:border-[--accent]">
            <option value="all">All Types</option>
            <option value="B2C">B2C</option>
            <option value="Wholesale">Wholesale</option>
          </select>
        </div>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden md:block bg-[--bg-secondary] rounded-lg shadow-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[--bg-tertiary]">
            <tr>
              <th className="p-4 font-semibold"><SortableHeader label="Store Name" sortKey="name" /></th>
              <th className="p-4 font-semibold"><SortableHeader label="Total Sales" sortKey="totalSales" /></th>
              <th className="p-4 font-semibold text-[--text-secondary]">Status</th>
              <th className="p-4 font-semibold text-[--text-secondary]">Payout Status</th>
              <th className="p-4 font-semibold text-[--text-secondary]">Last Action</th>
              <th className="p-4 font-semibold text-[--text-secondary]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredSellers.map(seller => (
              <tr key={seller.id} className="border-b border-[--border-color] hover:bg-[--bg-tertiary]">
                <td className="p-4 font-bold text-[--text-primary]">
                   <div className="flex items-center gap-2">
                      <span>{seller.name}</span>
                      {seller.isVerified && <VerifiedBadge />}
                  </div>
                </td>
                <td className="p-4 text-[--text-primary]">{formatPrice(seller.performance.totalSales, 'GBP')}</td>
                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClass(seller.status)}`}>{seller.status}</span></td>
                <td className="p-4"><PayoutStatusBadge status={seller.financials.kycStatus} /></td>
                <td className="p-4 text-sm text-[--text-muted]">{lastLogEntry(seller)}</td>
                <td className="p-4">
                    <div className="flex gap-4 items-center">
                        <Link to={`/admin/financials?sellerId=${seller.id}`} className="text-blue-400 hover:text-blue-300 font-semibold text-sm">Financials</Link>
                        <button onClick={() => handleOpenModalForEdit(seller)} className="text-[--accent] hover:text-[--accent-hover] font-semibold text-sm">Edit</button>
                    </div>
                </td>
              </tr>
            ))}
             {sortedAndFilteredSellers.length === 0 && (
                <tr><td colSpan={6} className="text-center p-8 text-[--text-muted]">No sellers match the current filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {sortedAndFilteredSellers.map(seller => (
           <div key={seller.id} className="bg-[--bg-secondary] rounded-lg shadow-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-[--text-primary] flex flex-wrap items-center gap-2">
                    <span>{seller.name}</span>
                    {seller.isVerified && <VerifiedBadge />}
                  </h3>
                  <p className="text-sm text-[--text-muted]">{seller.businessName}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClass(seller.status)}`}>{seller.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm border-t border-b border-[--border-color] py-2">
                <div>
                  <p className="text-xs text-[--text-muted]">Total Sales</p>
                  <p className="font-semibold text-green-500">{formatPrice(seller.performance.totalSales, 'GBP')}</p>
                </div>
                <div>
                  <p className="text-xs text-[--text-muted]">Payout Status</p>
                  <PayoutStatusBadge status={seller.financials.kycStatus} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-[--text-muted]">Last action: {lastLogEntry(seller)}</p>
                <div className="flex gap-4 items-center">
                    <Link to={`/admin/financials?sellerId=${seller.id}`} className="text-blue-400 hover:text-blue-300 font-bold text-sm">Financials</Link>
                    <button onClick={() => handleOpenModalForEdit(seller)} className="px-4 py-1 bg-[--accent] text-[--accent-foreground] font-bold rounded-full text-sm">Edit</button>
                </div>
              </div>
            </div>
        ))}
         {sortedAndFilteredSellers.length === 0 && <div className="text-center p-8 text-[--text-muted] bg-[--bg-secondary] rounded-lg">No sellers match the current filters.</div>}
      </div>

       {isModalOpen && (
        <SellerForm
          seller={editingSeller}
          onClose={handleCloseModal}
          onSave={handleSaveSeller}
        />
      )}
    </div>
  );
};