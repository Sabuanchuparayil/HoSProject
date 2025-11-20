import React, { useState } from 'react';
import { Product, ProductWithTotalStock, InventoryLocation, LocalizedString, Pricing, ProductMedia } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface AdminBulkUploadPageProps {
  products: ProductWithTotalStock[];
  onAddProduct: (product: Omit<Product, 'id' | 'sellerId'> & { sellerId?: number }) => void;
  onUpdateProduct: (product: Product) => void;
}

const parseCSV = (csvText: string): Record<string, string>[] => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length < headers.length) continue;
        const rowObject: Record<string, string> = {};
        headers.forEach((header, index) => {
            rowObject[header] = values[index]?.trim() || '';
        });
        data.push(rowObject);
    }
    return data;
}

const sellerTemplate = `id,name_en,name_es,description_en,description_es,price_gbp,price_usd,price_eur,price_jpy,primary_image_url,fandom,subCategory,sku,barcode,inventory_main_stock,inventory_london_stock
,Enchanted Quill,Pluma Encantada,A self-writing quill perfect for taking notes,Una pluma que escribe sola,15.50,18.00,17.00,2500,http://example.com/quill.jpg,Harry Potter,Books & Stationary,STAT-QUILL-01,5055588636802,100,20
1,The Elder Wand (Collector's Edition),La Varita de Saúco (Edición Coleccionista),An authentic hand-painted replica,Una réplica auténtica pintada a mano,39.99,49.99,45.99,7000,http://example.com/elderwand-v2.jpg,Harry Potter,Wands,WAND-HP-ELDR-01-CE,5055588636789,10,5`;

const adminTemplate = `id,name_en,name_es,description_en,description_es,price_gbp,price_usd,price_eur,price_jpy,primary_image_url,fandom,subCategory,sku,barcode,inventory_main_stock,inventory_london_stock,sellerId
,Enchanted Quill,Pluma Encantada,A self-writing quill perfect for taking notes,Una pluma que escribe sola,15.50,18.00,17.00,2500,http://example.com/quill.jpg,Harry Potter,Books & Stationary,STAT-QUILL-01,5055588636802,100,20,2
1,The Elder Wand (Collector's Edition),La Varita de Saúco (Edición Coleccionista),An authentic hand-painted replica,Una réplica auténtica pintada a mano,39.99,49.99,45.99,7000,http://example.com/elderwand-v2.jpg,Harry Potter,Wands,WAND-HP-ELDR-01-CE,5055588636789,10,5,1`;


export const AdminBulkUploadPage: React.FC<AdminBulkUploadPageProps> = ({ products, onAddProduct, onUpdateProduct }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const { user } = useAuth();

    const handleDownloadTemplate = () => {
        const csvContent = user?.role === 'admin' ? adminTemplate : sellerTemplate;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "product_upload_template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileSelect = (selectedFile: File | null) => {
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setLogs([]);
        } else {
            alert('Please upload a valid .csv file.');
        }
    }

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files[0] || null);
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e.target.files?.[0] || null);
    }

    const processRow = (row: Record<string, string>, index: number): Promise<string> => {
        return new Promise(resolve => {
            setTimeout(() => {
                try {
                    // Basic validation
                    const requiredFields = ['name_en', 'sku', 'fandom', 'subCategory', 'price_gbp'];
                    for (const field of requiredFields) {
                        if (!row[field]) throw new Error(`Missing required field '${field}'`);
                    }

                    const media: ProductMedia[] = [];
                    if (row.primary_image_url) {
                        media.push({ type: 'image', url: row.primary_image_url });
                    }

                    const productData = {
                        name: { en: row.name_en, es: row.name_es || row.name_en },
                        description: { en: row.description_en, es: row.description_es || row.description_en },
                        pricing: {
                            GBP: parseFloat(row.price_gbp) || 0,
                            USD: parseFloat(row.price_usd) || 0,
                            EUR: parseFloat(row.price_eur) || 0,
                            JPY: parseFloat(row.price_jpy) || 0,
                        },
                        media: media,
                        taxonomy: { fandom: row.fandom, subCategory: row.subCategory },
                        sku: row.sku,
                        barcode: row.barcode || undefined,
                        inventory: [
                            { centreId: 'main', name: 'Main Warehouse', stock: parseInt(row.inventory_main_stock) || 0 },
                            { centreId: 'london', name: 'London Store', stock: parseInt(row.inventory_london_stock) || 0 },
                        ],
                    };
                    
                    const productId = row.id ? parseInt(row.id, 10) : null;
                    
                    if (user?.role === 'seller') {
                        if (productId) { // Update existing product
                            const existingProduct = products.find(p => p.id === productId);
                            if (!existingProduct || existingProduct.sellerId !== user.id) {
                                throw new Error(`Product ID ${productId} not found or you don't have permission to edit it.`);
                            }
                            onUpdateProduct({ ...existingProduct, ...productData, id: productId, sellerId: user.id });
                            resolve(`UPDATE: Updated product '${productData.name.en}' (ID: ${productId}).`);
                        } else { // Create new product
                            onAddProduct(productData);
                            resolve(`CREATE: Added new product '${productData.name.en}'.`);
                        }
                    } else if (user?.role === 'admin') {
                        const sellerId = parseInt(row.sellerId, 10);
                        if (!sellerId) throw new Error(`Admin must provide a valid 'sellerId'.`);

                        if (productId) { // Update existing product
                             const existingProduct = products.find(p => p.id === productId);
                             if (!existingProduct) throw new Error(`Product with ID ${productId} not found.`);
                             onUpdateProduct({ ...existingProduct, ...productData, id: productId, sellerId });
                             resolve(`UPDATE: Updated product '${productData.name.en}' for seller ${sellerId}.`);
                        } else { // Create new product
                            onAddProduct({ ...productData, sellerId });
                            resolve(`CREATE: Added new product '${productData.name.en}' for seller ${sellerId}.`);
                        }
                    } else {
                        throw new Error("Unauthorized action.");
                    }
                } catch (e: any) {
                    resolve(`ERROR: Row ${index + 2}: ${e.message}`);
                }
            }, 50 * index); // Stagger processing to simulate real work and update UI
        });
    };

    const handleProcessUpload = async () => {
        if (!file) return;

        setIsProcessing(true);
        setLogs(['Starting process...']);

        const csvText = await file.text();
        const rows = parseCSV(csvText);
        
        if (rows.length === 0) {
            setLogs(prev => [...prev, 'ERROR: File is empty or has an invalid format.']);
            setIsProcessing(false);
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            const result = await processRow(rows[i], i);
            setLogs(prev => [...prev, result]);
        }

        setLogs(prev => [...prev, 'Processing complete.']);
        setIsProcessing(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold font-cinzel text-[--text-primary] mb-2">Bulk Product Upload</h1>
            <p className="text-[--text-muted] mb-8">Efficiently add or update products using a CSV template.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1: Template */}
                <div className="bg-[--bg-secondary] p-6 rounded-lg shadow-lg border border-[--border-color]">
                    <h2 className="text-xl font-bold font-cinzel text-[--accent]">1. Download Template</h2>
                    <p className="text-sm text-[--text-muted] mt-2 mb-4">Start with our template file which includes the correct columns and example rows.</p>
                    <button onClick={handleDownloadTemplate} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-full text-sm hover:bg-blue-700 transition">Download Template with Examples</button>
                    <div className="text-xs text-[--text-muted] mt-4 space-y-2">
                        <p><strong>Important:</strong></p>
                        <ul className="list-disc list-inside pl-2">
                            <li>To update a product, include its 'id'.</li>
                            <li>To create a new product, leave the 'id' column blank.</li>
                            <li>Do not use commas within any field values.</li>
                        </ul>
                    </div>
                </div>

                {/* Step 2: Upload */}
                <div className="bg-[--bg-secondary] p-6 rounded-lg shadow-lg border border-[--border-color]">
                    <h2 className="text-xl font-bold font-cinzel text-[--accent]">2. Upload File</h2>
                    <p className="text-sm text-[--text-muted] mt-2 mb-4">Drag and drop your completed CSV file here or click to select.</p>
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-input')?.click()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-[--accent] bg-[--accent]/10' : 'border-[--border-color] hover:border-gray-500'}`}
                    >
                        <input type="file" id="file-input" accept=".csv" onChange={handleFileChange} className="hidden" />
                        {file ? (
                            <p className="font-semibold text-green-400">✅ {file.name} selected</p>
                        ) : (
                            <p className="text-[--text-muted]">Drop CSV file here</p>
                        )}
                    </div>
                </div>

                {/* Step 3: Process */}
                 <div className="bg-[--bg-secondary] p-6 rounded-lg shadow-lg border border-[--border-color]">
                    <h2 className="text-xl font-bold font-cinzel text-[--accent]">3. Process & Review</h2>
                    <p className="text-sm text-[--text-muted] mt-2 mb-4">Once your file is uploaded, process it to see the results.</p>
                     <button 
                        onClick={handleProcessUpload}
                        disabled={!file || isProcessing}
                        className="w-full px-4 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full text-sm hover:bg-[--accent-hover] transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                     >
                        {isProcessing ? 'Processing...' : 'Process File'}
                    </button>
                </div>
            </div>
            
            {/* Log Output */}
            {logs.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold font-cinzel text-[--text-primary] mb-4">Processing Log</h3>
                    <div className="bg-[#0c1424] p-4 rounded-lg font-mono text-sm text-gray-300 max-h-96 overflow-y-auto">
                        {logs.map((log, index) => {
                            let color = 'text-gray-300';
                            if (log.startsWith('CREATE')) color = 'text-green-400';
                            if (log.startsWith('UPDATE')) color = 'text-yellow-400';
                            if (log.startsWith('ERROR')) color = 'text-red-400';
                            return <p key={index} className={color}>{`> ${log}`}</p>;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};