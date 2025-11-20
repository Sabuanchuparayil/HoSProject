import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ThemeHero } from '../types';

export const Hero: React.FC<ThemeHero> = ({ image, title, subtitle }) => {
    const { t } = useLanguage();

    const handleExploreClick = () => {
        const productSection = document.getElementById('product-section');
        if (productSection) {
            productSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <div 
            className="relative bg-cover bg-center h-[60vh] flex items-center justify-center text-center"
            style={{ backgroundImage: `url('${image}')` }}
        >
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="relative z-10 px-4">
                <h1 className="text-5xl md:text-7xl font-cinzel font-extrabold text-white tracking-wider leading-tight">
                    {t(title)}
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                    {t(subtitle)}
                </p>
                <button 
                    onClick={handleExploreClick}
                    className="mt-8 px-8 py-3 bg-[--accent] text-[--bg-primary] font-bold text-lg rounded-full hover:bg-[--accent-hover] transition duration-300 transform hover:scale-105 shadow-lg shadow-[--accent]/20">
                    Explore Collections
                </button>
            </div>
        </div>
    );
};
