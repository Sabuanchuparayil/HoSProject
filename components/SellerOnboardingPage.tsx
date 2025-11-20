import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Seller } from '../types';
import { TAXONOMY_DATA } from '../data/taxonomy';

interface SellerOnboardingPageProps {
    onAddSeller: (application: Omit<Seller, 'id' | 'theme' | 'status' | 'applicationDate' | 'isVerified' | 'performance' | 'auditLog' | 'financials' | 'unlockedThemes'>) => void;
}

export const SellerOnboardingPage: React.FC<SellerOnboardingPageProps> = ({ onAddSeller }) => {
    const [formData, setFormData] = useState({
        name: '', // Storefront name
        businessName: '',
        contactEmail: '',
        type: 'B2C' as 'B2C' | 'Wholesale',
        businessAddress: {
            addressLine1: '',
            city: '',
            postalCode: '',
            country: 'GB'
        },
        productCategories: [] as string[],
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const fandoms = Object.keys(TAXONOMY_DATA);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            businessAddress: {
                ...prev.businessAddress,
                [name]: value,
            }
        }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const categories = prev.productCategories;
            if (checked) {
                return { ...prev, productCategories: [...categories, value] };
            } else {
                return { ...prev, productCategories: categories.filter(cat => cat !== value) };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.productCategories.length === 0) {
            alert("Please select at least one product category you intend to sell.");
            return;
        }
        onAddSeller(formData);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-3xl mx-auto bg-[--bg-secondary] p-8 rounded-lg shadow-xl text-center">
                    <h1 className="text-4xl font-cinzel font-bold text-[--accent] mb-6">Application Received!</h1>
                    <p className="text-[--text-muted] mb-8">
                        Thank you for your interest. Our team will review your application and get back to you at <span className="font-semibold text-[--text-primary]">{formData.contactEmail}</span> within 3-5 business days.
                    </p>
                    <Link to="/" className="px-10 py-4 bg-[--accent] text-[--bg-primary] font-bold text-xl rounded-full hover:bg-[--accent-hover] transition duration-300">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-3xl mx-auto bg-[--bg-secondary] p-8 rounded-lg shadow-xl">
                <div className="text-center">
                    <h1 className="text-4xl font-cinzel font-bold text-[--accent] mb-6">Become a Seller</h1>
                    <p className="text-[--text-muted] mb-8">
                        Join our curated marketplace of licensed fandom merchandise and reach a global audience of passionate fans.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <fieldset className="space-y-6 bg-[--bg-primary]/50 p-6 rounded-lg">
                        <legend className="text-xl font-cinzel font-semibold text-[--accent] mb-4">Business Details</legend>
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-[--text-muted]">Legal Business Name</label>
                            <input type="text" name="businessName" id="businessName" value={formData.businessName} onChange={handleChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[--text-muted]">Public Storefront Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
                        </div>
                        <div>
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-[--text-muted]">Contact Email</label>
                            <input type="email" name="contactEmail" id="contactEmail" value={formData.contactEmail} onChange={handleChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
                        </div>
                         <div className="space-y-2">
                             <label className="block text-sm font-medium text-[--text-muted]">Business Address</label>
                             <input type="text" name="addressLine1" placeholder="Address Line 1" value={formData.businessAddress.addressLine1} onChange={handleAddressChange} required className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input type="text" name="city" placeholder="City" value={formData.businessAddress.city} onChange={handleAddressChange} required className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                                <input type="text" name="postalCode" placeholder="Postal Code" value={formData.businessAddress.postalCode} onChange={handleAddressChange} required className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                                <select name="country" value={formData.businessAddress.country} onChange={handleAddressChange} required className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2 text-[--text-primary]">
                                    <option value="GB">United Kingdom</option>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                </select>
                             </div>
                        </div>
                    </fieldset>

                     <fieldset className="space-y-6 bg-[--bg-primary]/50 p-6 rounded-lg">
                        <legend className="text-xl font-cinzel font-semibold text-[--accent] mb-4">Product Information</legend>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-[--text-muted]">Seller Type</label>
                            <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]">
                                <option value="B2C">Consumer Store (B2C)</option>
                                <option value="Wholesale">Wholesale / Business (B2B)</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-[--text-muted]">What categories of products will you sell? (select all that apply)</label>
                            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {fandoms.map(fandom => (
                                    <label key={fandom} htmlFor={`category-${fandom}`} className="flex items-center p-2 bg-[--bg-primary] rounded-md hover:bg-[--bg-tertiary] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id={`category-${fandom}`}
                                            value={fandom}
                                            checked={formData.productCategories.includes(fandom)}
                                            onChange={handleCategoryChange}
                                            className="h-4 w-4 rounded border-gray-500 text-[--accent] focus:ring-[--accent]"
                                        />
                                        <span className="ml-2 text-sm text-[--text-secondary]">{fandom}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </fieldset>
                    
                    <div className="text-center pt-4">
                        <button type="submit" className="px-10 py-4 bg-[--accent] text-[--bg-primary] font-bold text-xl rounded-full hover:bg-[--accent-hover] transition duration-300 transform hover:scale-105 shadow-lg shadow-[--accent]/20">
                            Submit Application
                        </button>
                    </div>
                </form>

                 <p className="mt-6 text-center text-sm text-[--text-muted]">
                    Already a seller?{' '}
                    <Link to="/admin" className="font-medium text-[--accent] hover:text-[--accent-hover]">
                        Go to your dashboard
                    </Link>
                </p>
            </div>
        </div>
    );
};