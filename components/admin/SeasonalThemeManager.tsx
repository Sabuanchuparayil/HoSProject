import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Theme } from '../../types';

export const SeasonalThemeManager: React.FC = () => {
    const { seasonalThemeConfig, setSeasonalThemeConfig, availableThemes } = useTheme();

    const handleConfigChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setSeasonalThemeConfig({
            ...seasonalThemeConfig,
            [name]: value
        });
    };

    const handleToggleActive = () => {
        setSeasonalThemeConfig({
            ...seasonalThemeConfig,
            isActive: !seasonalThemeConfig.isActive
        });
    };

    return (
        <div className="bg-[--bg-secondary] border border-[--border-color] rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold font-cinzel text-[--accent]">Global Seasonal Theme</h2>
                    <p className="text-sm text-[--text-muted] mt-1">
                        Override the default site theme for all users during a specific period.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[--text-secondary]">
                        {seasonalThemeConfig.isActive ? 'Active' : 'Inactive'}
                    </span>
                     <label htmlFor="seasonal-toggle" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" id="seasonal-toggle" className="sr-only" checked={seasonalThemeConfig.isActive} onChange={handleToggleActive} />
                            <div className={`block w-10 h-6 rounded-full transition ${seasonalThemeConfig.isActive ? 'bg-[--accent]' : 'bg-[--bg-primary]'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${seasonalThemeConfig.isActive ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                    </label>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 border-t border-[--border-color] pt-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[--text-muted]">Theme</label>
                    <select
                        name="name"
                        id="name"
                        value={seasonalThemeConfig.name || ''}
                        onChange={handleConfigChange}
                        className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-[--text-primary] focus:ring-[--accent] focus:border-[--accent]"
                    >
                        <option value="">None</option>
                        {Object.entries(availableThemes).map(([id, name]) => (
                             <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-[--text-muted]">Start Date (optional)</label>
                    <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={seasonalThemeConfig.startDate || ''}
                        onChange={handleConfigChange}
                        className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-[--text-primary] focus:ring-[--accent] focus:border-[--accent]"
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-[--text-muted]">End Date (optional)</label>
                    <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={seasonalThemeConfig.endDate || ''}
                        onChange={handleConfigChange}
                        className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-[--text-primary] focus:ring-[--accent] focus:border-[--accent]"
                    />
                </div>
            </div>
        </div>
    );
};