import React, { useState, FormEvent, DragEvent, useRef } from 'react';
import { Product, InventoryLocation, LocalizedString, Pricing, ProductWithTotalStock, ProductMedia, Seller } from '../../types';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { TAXONOMY_DATA } from '../../data/taxonomy';
import { useAuth } from '../../contexts/AuthContext';

interface ProductFormProps {
  product?: Product;
  sellers?: Seller[];
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id' | 'sellerId'> & { sellerId?: number }) => void;
  onUpdateProduct: (product: Product) => void;
}

// FIX: Replaced 'category' with a 'taxonomy' object to match the Product type.
const initialProductState = {
  name: { en: '', es: '' },
  description: { en: '', es: '' },
  pricing: { USD: 0, EUR: 0, GBP: 0, JPY: 0 },
  rrp: { USD: 0, EUR: 0, GBP: 0, JPY: 0 },
  tradePrice: { USD: 0, EUR: 0, GBP: 0, JPY: 0 },
  media: [],
  taxonomy: { fandom: '', subCategory: '' },
  sku: '',
  barcode: '',
  inventory: [{ centreId: 'main', name: 'Main Warehouse', stock: 0 }],
  sellerId: undefined,
};

export const ProductForm: React.FC<ProductFormProps> = ({ product, sellers, onClose, onAddProduct, onUpdateProduct }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(() => {
    const initialState = product || initialProductState;
    return {
      ...initialState,
      rrp: initialState.rrp || initialProductState.rrp,
      tradePrice: initialState.tradePrice || initialProductState.tradePrice,
      sellerId: product ? product.sellerId : (user?.role === 'admin' ? undefined : user?.id),
    };
  });
  const { languages } = useLanguage();
  const { currencies } = useCurrency();
  const [activeLangTab, setActiveLangTab] = useState('en');
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const isEditing = product !== undefined;

  const fandoms = Object.keys(TAXONOMY_DATA);
  const availableSubCategories = formData.taxonomy.fandom ? TAXONOMY_DATA[formData.taxonomy.fandom] || [] : [];

  const handleLocalizedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: {
        ...prev[name as keyof typeof prev] as LocalizedString,
        [activeLangTab]: value
      }
    }));
  };

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'pricing' | 'rrp' | 'tradePrice') => {
      const { name, value } = e.target;
      setFormData(prev => ({
          ...prev,
          [field]: {
              ...(prev[field] as Pricing),
              [name]: parseFloat(value) || 0
          }
      }));
  };

  const handleInventoryChange = (index: number, field: keyof InventoryLocation, value: string | number) => {
      const newInventory = [...formData.inventory];
      (newInventory[index] as any)[field] = field === 'stock' ? parseInt(value as string, 10) || 0 : value;
      setFormData(prev => ({ ...prev, inventory: newInventory }));
  };

  const addInventoryLocation = () => {
      setFormData(prev => ({
          ...prev,
          inventory: [...prev.inventory, { centreId: `new-${Date.now()}`, name: '', stock: 0 }]
      }));
  };

  const removeInventoryLocation = (index: number) => {
      setFormData(prev => ({
          ...prev,
          inventory: prev.inventory.filter((_, i) => i !== index)
      }));
  };
  
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'sellerId' ? (value ? parseInt(value) : undefined) : value }));
  }

  const handleTaxonomyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'fandom') {
        setFormData(prev => ({
            ...prev,
            taxonomy: {
                ...prev.taxonomy,
                fandom: value,
                subCategory: ''
            }
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            taxonomy: {
                ...prev.taxonomy,
                [name]: value
            }
        }));
    }
  };
  
  const handleMediaChange = (index: number, field: keyof ProductMedia, value: string) => {
    const newMedia = [...formData.media];
    (newMedia[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, media: newMedia }));
  };

  const addMediaItem = () => {
    setFormData(prev => ({ ...prev, media: [...prev.media, { type: 'image', url: '' }]}));
  };

  const removeMediaItem = (index: number) => {
    setFormData(prev => ({ ...prev, media: prev.media.filter((_, i) => i !== index) }));
  };
  
  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newMedia = [...formData.media];
    const draggedItemContent = newMedia.splice(dragItem.current, 1)[0];
    newMedia.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setFormData(prev => ({ ...prev, media: newMedia }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if(isEditing) {
      const { stock, ...productToUpdate } = formData as ProductWithTotalStock;
      onUpdateProduct(productToUpdate as Product);
    } else {
      onAddProduct(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-4xl max-h-full flex flex-col">
        <h2 className="text-2xl font-bold font-cinzel text-[--text-primary] mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-4 -mr-4">
          {/* Product Info & Translations */}
          <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg">
            <h3 className="font-semibold text-[--accent] mb-2">Product Information & Translations</h3>
            <div className="mb-4 border-b border-[--border-color]">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {Object.keys(languages).map(lang => (
                        <button key={lang} type="button" onClick={() => setActiveLangTab(lang)} className={`${activeLangTab === lang ? 'border-[--accent] text-[--accent]' : 'border-transparent text-[--text-muted] hover:text-[--text-secondary] hover:border-gray-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>
                            {languages[lang]}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[--text-muted]">Product Name ({languages[activeLangTab]})</label>
                    <input type="text" name="name" id="name" value={formData.name[activeLangTab] || ''} onChange={handleLocalizedChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[--text-muted]">Description ({languages[activeLangTab]})</label>
                    <textarea name="description" id="description" value={formData.description[activeLangTab] || ''} onChange={handleLocalizedChange} required rows={4} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"></textarea>
                </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user?.role === 'admin' && (
                  <div className="md:col-span-2">
                    <label htmlFor="sellerId" className="block text-sm font-medium text-[--text-muted]">Seller</label>
                    <select name="sellerId" id="sellerId" value={formData.sellerId} onChange={handleGeneralChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]">
                        <option value="">Select a Seller</option>
                        {sellers?.filter(s => s.status === 'approved').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                )}
                <div>
                    <label htmlFor="fandom" className="block text-sm font-medium text-[--text-muted]">Fandom</label>
                    <select name="fandom" id="fandom" value={formData.taxonomy.fandom} onChange={handleTaxonomyChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]">
                        <option value="">Select a Fandom</option>
                        {fandoms.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="subCategory" className="block text-sm font-medium text-[--text-muted]">Sub-Category</label>
                    <select name="subCategory" id="subCategory" value={formData.taxonomy.subCategory} onChange={handleTaxonomyChange} required disabled={!formData.taxonomy.fandom} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent] disabled:bg-gray-700/50 disabled:cursor-not-allowed">
                        <option value="">Select a Sub-Category</option>
                        {availableSubCategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-[--text-muted]">SKU</label>
                    <input type="text" name="sku" id="sku" value={formData.sku} onChange={handleGeneralChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
                </div>
                <div>
                    <label htmlFor="barcode" className="block text-sm font-medium text-[--text-muted]">Barcode (EAN, UPC)</label>
                    <input type="text" name="barcode" id="barcode" value={formData.barcode || ''} onChange={handleGeneralChange} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
                </div>
            </div>

            {/* Media Management */}
            <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg">
                <h3 className="font-semibold text-[--accent] mb-2">Product Media</h3>
                <div className="space-y-3">
                    {formData.media.map((media, index) => (
                        <div key={index} 
                             draggable 
                             onDragStart={() => dragItem.current = index}
                             onDragEnter={() => dragOverItem.current = index}
                             onDragEnd={handleDragSort}
                             onDragOver={(e) => e.preventDefault()}
                             className="grid grid-cols-12 gap-2 items-center p-2 rounded-md bg-[--bg-primary] cursor-grab active:cursor-grabbing">
                            <div className="col-span-1 text-center text-[--text-muted]">☰</div>
                            <input type="url" placeholder="Media URL" value={media.url} onChange={(e) => handleMediaChange(index, 'url', e.target.value)} required className="col-span-6 block w-full bg-[--bg-secondary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-sm"/>
                            <select value={media.type} onChange={(e) => handleMediaChange(index, 'type', e.target.value)} className="col-span-3 block w-full bg-[--bg-secondary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-sm">
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                                <option value="image_360">360° Image</option>
                            </select>
                             <div className="col-span-2 text-right">
                               <button type="button" onClick={() => removeMediaItem(index)} className="text-red-600 hover:text-red-500 p-2 rounded-full text-sm">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addMediaItem} className="mt-3 text-sm text-[--accent] hover:text-[--accent-hover] font-semibold">+ Add Media</button>
            </div>
          
          <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg">
            <h3 className="font-semibold text-[--accent] mb-2">Pricing (B2C Selling Price)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(currencies).map(code => (
                     <div key={code}>
                        <label htmlFor={`pricing-${code}`} className="block text-sm font-medium text-[--text-muted]">{code}</label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-[--text-muted] sm:text-sm">{currencies[code].symbol}</span>
                            </div>
                            <input type="number" name={code} id={`pricing-${code}`} value={formData.pricing[code] || ''} onChange={e => handlePricingChange(e, 'pricing')} required min="0" step="0.01" className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 pl-7 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
                        </div>
                    </div>
                ))}
            </div>
          </div>
          
          <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg">
            <h3 className="font-semibold text-[--accent] mb-2">Suggested Retail Price (RRP)</h3>
            <p className="text-xs text-gray-500 mt-1 mb-2">Optional. The recommended price for consumer resale. Leave as 0 if not applicable.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(currencies).map(code => (
                     <div key={code}>
                        <label htmlFor={`rrp-${code}`} className="block text-sm font-medium text-[--text-muted]">{code}</label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-[--text-muted] sm:text-sm">{currencies[code].symbol}</span>
                            </div>
                            <input type="number" name={code} id={`rrp-${code}`} value={formData.rrp?.[code] || ''} onChange={e => handlePricingChange(e, 'rrp')} min="0" step="0.01" className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 pl-7 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg">
            <h3 className="font-semibold text-[--accent] mb-2">Trade/Wholesale Price (B2B)</h3>
            <p className="text-xs text-gray-500 mt-1 mb-2">Optional. The price for business-to-business sales. Leave as 0 if not applicable.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(currencies).map(code => (
                     <div key={code}>
                        <label htmlFor={`tradePrice-${code}`} className="block text-sm font-medium text-[--text-muted]">{code}</label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-[--text-muted] sm:text-sm">{currencies[code].symbol}</span>
                            </div>
                            <input type="number" name={code} id={`tradePrice-${code}`} value={formData.tradePrice?.[code] || ''} onChange={e => handlePricingChange(e, 'tradePrice')} min="0" step="0.01" className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 pl-7 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
                        </div>
                    </div>
                ))}
            </div>
          </div>
          
          <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg">
             <h3 className="font-semibold text-[--accent] mb-2">Inventory Management</h3>
             <div className="space-y-3">
                {formData.inventory.map((loc, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <input type="text" placeholder="Location Name" value={loc.name} onChange={(e) => handleInventoryChange(index, 'name', e.target.value)} required className="col-span-6 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
                        <input type="number" placeholder="Stock" value={loc.stock} onChange={(e) => handleInventoryChange(index, 'stock', e.target.value)} required min="0" className="col-span-4 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
                        <div className="col-span-2">
                           {formData.inventory.length > 1 && <button type="button" onClick={() => removeInventoryLocation(index)} className="text-red-600 hover:text-red-500 p-2 rounded-full">Remove</button>}
                        </div>
                    </div>
                ))}
             </div>
             <button type="button" onClick={addInventoryLocation} className="mt-3 text-sm text-[--accent] hover:text-[--accent-hover] font-semibold">+ Add Location</button>
          </div>

          <div className="flex justify-end gap-4 pt-4 mt-auto">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color] transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">{isEditing ? 'Save Changes' : 'Add Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
