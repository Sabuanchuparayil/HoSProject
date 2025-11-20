import React, { useState, FormEvent, DragEvent } from 'react';
import { ThemeConfiguration, LocalizedString } from '../../types';

interface ThemeFormProps {
  theme?: ThemeConfiguration;
  onClose: () => void;
  onAddTheme: (theme: ThemeConfiguration) => void;
  onUpdateTheme: (theme: ThemeConfiguration) => void;
}

// FIX: Added 'productPageLayout' to satisfy the Omit<ThemeConfiguration, 'id'> type.
const initialThemeState: Omit<ThemeConfiguration, 'id'> = {
  name: '',
  hero: { title: { en: '', es: ''}, subtitle: {en: '', es: ''}, image: '' },
  layout: 'standard',
  productPageLayout: 'classic-split',
  price: 0,
  isCustom: true,
  isAvailable: true,
  cssContent: '',
};

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};


export const ThemeForm: React.FC<ThemeFormProps> = ({ theme, onClose, onAddTheme, onUpdateTheme }) => {
  const [formData, setFormData] = useState(theme || initialThemeState);
  const [cssFile, setCssFile] = useState<File | null>(null);
  const isEditing = theme !== undefined;
  
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData(prev => ({ 
        ...prev, 
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : (name === 'price' ? Number(value) : value) 
    }));
  };
  
  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        hero: {
            ...prev.hero,
            [name]: value
        }
    }));
  };
  
  const handleHeroLocaleChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'title' | 'subtitle') => {
    const { name, value } = e.target; // name will be 'en' or 'es'
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: {
          ...(prev.hero[field] as LocalizedString),
          [name]: value
        }
      }
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type === 'text/css') {
          setCssFile(file);
      } else {
          alert('Please upload a valid .css file.');
          setCssFile(null);
          e.target.value = '';
      }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let finalCssContent = formData.cssContent;
    
    if (cssFile) {
        try {
            finalCssContent = await readFileAsText(cssFile);
        } catch (error) {
            console.error("Error reading CSS file:", error);
            alert("Could not read the selected CSS file.");
            return;
        }
    }
    
    if (isEditing) {
      onUpdateTheme({ ...formData, cssContent: finalCssContent });
    } else {
      // Create a slug-like ID for the new theme
      const newId = formData.name.toLowerCase().replace(/\s+/g, '-');
      onAddTheme({ ...formData, id: newId, cssContent: finalCssContent });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold font-cinzel text-[--text-primary] mb-6">{isEditing ? 'Edit Theme' : 'Upload New Theme'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="name" className="block text-sm font-medium text-[--text-muted]">Theme Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleGeneralChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-[--text-muted]">Price (GBP)</label>
                <input type="number" name="price" id="price" value={formData.price} onChange={handleGeneralChange} required min="0" step="0.01" className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"/>
            </div>
          </div>
          
          <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg space-y-4">
             <h3 className="font-semibold text-[--accent] mb-2">Hero Section</h3>
             <div>
                <label htmlFor="image" className="block text-sm font-medium text-[--text-muted]">Hero Image URL</label>
                <input type="url" name="image" id="image" value={formData.hero.image} onChange={handleHeroChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary]"/>
             </div>
             <div>
                <label className="block text-sm font-medium text-[--text-muted]">Hero Title (EN / ES)</label>
                <div className="flex gap-2 mt-1">
                    <input type="text" name="en" value={formData.hero.title.en} onChange={(e) => handleHeroLocaleChange(e, 'title')} placeholder="English Title" required className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                    <input type="text" name="es" value={formData.hero.title.es} onChange={(e) => handleHeroLocaleChange(e, 'title')} placeholder="Spanish Title" className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-[--text-muted]">Hero Subtitle (EN / ES)</label>
                <div className="flex gap-2 mt-1">
                    <input type="text" name="en" value={formData.hero.subtitle.en} onChange={(e) => handleHeroLocaleChange(e, 'subtitle')} placeholder="English Subtitle" required className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                    <input type="text" name="es" value={formData.hero.subtitle.es} onChange={(e) => handleHeroLocaleChange(e, 'subtitle')} placeholder="Spanish Subtitle" className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                </div>
             </div>
          </div>

          <div>
             <label htmlFor="cssFile" className="block text-sm font-medium text-[--text-muted]">Theme CSS File</label>
             <p className="text-xs text-[--text-muted] mb-2">Upload a .css file containing the theme's color variables (e.g., --bg-primary, --accent).</p>
             <input type="file" name="cssFile" id="cssFile" accept=".css" onChange={handleFileChange} required={!isEditing} className="mt-1 block w-full text-sm text-[--text-secondary] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[--accent] file:text-[--accent-foreground] hover:file:bg-[--accent-hover]"/>
             {cssFile && <span className="text-xs text-green-500">Selected: {cssFile.name}</span>}
          </div>
          
           <div className="flex items-center">
                <input id="isAvailable" name="isAvailable" type="checkbox" checked={formData.isAvailable} onChange={handleGeneralChange} className="h-4 w-4 rounded border-[--border-color] text-[--accent] focus:ring-[--accent] bg-[--bg-primary]" />
                <label htmlFor="isAvailable" className="ml-3 block text-sm font-medium text-[--text-muted]">
                    Available to Sellers
                </label>
            </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color] transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">{isEditing ? 'Save Changes' : 'Add Theme'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};