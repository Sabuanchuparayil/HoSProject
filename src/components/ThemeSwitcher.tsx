import React from 'react';
// FIX: Import Theme from types.ts to resolve circular dependency
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';

const THEME_ICONS: { [key in Theme]?: string } = {
    dark: '🌙',
    light: '☀️',
    wholesale: '💼',
    halloween: '🎃',
    winter: '❄️',
};

export const ThemeSwitcher: React.FC = () => {
    const { 
        baseThemeId, 
        setBaseThemeId, 
        availableThemes,
        isB2BMode,
        setIsB2BMode,
        seasonalThemeConfig
    } = useTheme();

    const isSeasonalActive = seasonalThemeConfig.isActive && seasonalThemeConfig.name;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-cinzel font-bold text-[--accent]">Site Appearance</h3>
            
            {isSeasonalActive ? (
                <div className="p-3 bg-[--bg-primary] border border-[--accent]/50 rounded-md text-center">
                    <p className="text-2xl mb-1">{THEME_ICONS[seasonalThemeConfig.name!]}</p>
                    <p className="font-semibold text-[--text-primary]">
                        The {availableThemes[seasonalThemeConfig.name!]} theme is active!
                    </p>
                    <p className="text-xs text-[--text-muted]">Enjoy the seasonal event!</p>
                </div>
            ) : (
                <>
                    <div>
                        <label className="block text-sm font-medium text-[--text-muted] mb-2">Base Theme</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(availableThemes) as Theme[]).filter(t => !['wholesale', 'halloween', 'winter'].includes(t)).map(themeKey => (
                                <button
                                    key={themeKey}
                                    onClick={() => setBaseThemeId(themeKey)}
                                    className={`px-3 py-2 text-sm rounded-md transition-all border-2 ${baseThemeId === themeKey ? 'bg-[--accent] text-[--bg-primary] border-[--accent-hover] font-bold' : 'bg-[--bg-primary] border-[--border-color] hover:border-[--accent]'}`}
                                >
                                    {availableThemes[themeKey]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-[--border-color] my-4"></div>

                    <div>
                        <label htmlFor="b2b-toggle" className="flex justify-between items-center cursor-pointer">
                            <span className="text-sm font-medium text-[--text-muted]">Business Mode</span>
                             <div className="relative">
                                <input type="checkbox" id="b2b-toggle" className="sr-only" checked={isB2BMode} onChange={() => setIsB2BMode(!isB2BMode)} />
                                <div className={`block w-10 h-6 rounded-full transition ${isB2BMode ? 'bg-[--accent]' : 'bg-[--bg-primary]'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isB2BMode ? 'transform translate-x-4' : ''}`}></div>
                            </div>
                        </label>
                        <p className="text-xs text-[--text-muted] mt-1">Switch to the wholesale B2B storefront view.</p>
                    </div>
                </>
            )}
        </div>
    );
};