import React, { useMemo, useState } from 'react';
import { Seller, Theme, ThemeConfiguration } from '../../types';
import { SeasonalThemeManager } from './SeasonalThemeManager';

interface ThemeUsageCardProps {
    theme: ThemeConfiguration;
    sellersUsing: Seller[];
}

const ThemeUsageCard: React.FC<ThemeUsageCardProps> = ({ theme, sellersUsing }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const sellerCount = sellersUsing.length;

    const hasCustomizations = (seller: Seller) => {
        return seller.theme.customizations && Object.keys(seller.theme.customizations).length > 0;
    };

    return (
        <div className="bg-[--bg-secondary] border border-[--border-color] rounded-lg shadow-lg overflow-hidden">
            <div 
                className="h-32 bg-cover bg-center"
                style={{ backgroundImage: `url('${theme.hero.image}')` }}
            />
            <div className="p-4">
                <h3 className="font-bold font-cinzel text-lg text-[--text-primary]">{theme.name}</h3>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="w-full text-left text-sm mt-2 text-[--accent] hover:text-[--accent-hover] font-semibold"
                    disabled={sellerCount === 0}
                >
                    {sellerCount} {sellerCount === 1 ? 'seller' : 'sellers'} using this theme 
                    {sellerCount > 0 && <span className={`inline-block ml-2 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>}
                </button>
            </div>
            {isExpanded && sellerCount > 0 && (
                <div className="p-4 border-t border-[--border-color] bg-[--bg-primary]">
                    <ul className="space-y-2 text-sm max-h-48 overflow-y-auto">
                        {sellersUsing.map(seller => (
                            <li key={seller.id} className="flex justify-between items-center">
                                <span className="text-[--text-secondary]">{seller.name}</span>
                                {hasCustomizations(seller) && (
                                    <span title="This seller has applied custom styles" className="w-6 h-6 flex items-center justify-center bg-[--accent]/20 text-[--accent] text-xs font-bold rounded-full">
                                        C
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


interface AdminThemeUsagePageProps {
  sellers: Seller[];
  platformThemes: ThemeConfiguration[];
}

export const AdminThemeUsagePage: React.FC<AdminThemeUsagePageProps> = ({ sellers, platformThemes }) => {
  const themeUsage = useMemo(() => {
    const usageMap = new Map<Theme, Seller[]>();
    
    // Initialize map for all available themes to ensure they appear in the report
    platformThemes.forEach(theme => {
        usageMap.set(theme.id, []);
    });

    sellers.forEach(seller => {
      if (seller.status === 'approved') {
        const themeName = seller.theme.name;
        // The check `usageMap.has(themeName)` ensures we only count usage for themes that exist on the platform
        if (usageMap.has(themeName)) {
            usageMap.get(themeName)?.push(seller);
        }
      }
    });
    return usageMap;
  }, [sellers, platformThemes]);

  return (
    <div>
      <h1 className="text-3xl font-bold font-cinzel text-[--text-primary] mb-2">Theme Usage & Global Settings</h1>
      <p className="text-[--text-muted] mb-8">
        Oversee theme adoption by sellers and manage global event themes for the entire platform.
      </p>

      <SeasonalThemeManager />

      <h2 className="text-2xl font-bold font-cinzel text-[--accent] mb-4 mt-8">Theme Adoption Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {platformThemes.map(theme => (
          <ThemeUsageCard 
            key={theme.id}
            theme={theme}
            sellersUsing={themeUsage.get(theme.id) || []}
          />
        ))}
      </div>
    </div>
  );
};