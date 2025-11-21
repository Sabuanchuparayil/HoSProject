import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from "react";

import {
  SeasonalThemeConfig,
  ThemeConfiguration,
  Theme,
} from "../types";

import { getThemeConfig, getAvailableThemesMap } from "../services/themeService";
import { apiService } from "../services/apiService";

interface ThemeContextType {
  baseThemeId: Theme;
  setBaseThemeId: (themeId: Theme) => void;
  activeThemeConfig: ThemeConfiguration;
  availableThemes: Record<Theme, string>;
  seasonalThemeConfig: SeasonalThemeConfig;
  setSeasonalThemeConfig: (config: SeasonalThemeConfig) => void;
  isB2BMode: boolean;
  setIsB2BMode: (isB2B: boolean) => void;
  previewThemeId: Theme | null;
  setPreviewThemeId: (themeId: Theme | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const FALLBACK_THEME_CONFIG: ThemeConfiguration = {
  id: "light",
  name: "Default Light",
  layout: "standard",
  productPageLayout: "classic-split",
  hero: {
    image: "",
    title: { en: "House of Spells", es: "House of Spells" },
    subtitle: { en: "", es: "" },
  },
  price: 0,
  isCustom: false,
  isAvailable: true,
  css: {
    "bg-primary": "#ffffff",
    "text-primary": "#000000",
    "bg-secondary": "#f2f2f2",
    accent: "#6633ff",
    "accent-foreground": "#ffffff",
  },
};

// Utility to read localStorage safely
const getStoredPreference = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return fallback;
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [baseThemeId, setBaseThemeState] = useState<Theme>(() =>
    getStoredPreference<Theme>("baseThemeId", "light")
  );

  const [isB2BMode, setB2BModeState] = useState<boolean>(() =>
    getStoredPreference<boolean>("isB2BMode", false)
  );

  const [seasonalThemeConfig, setSeasonalThemeConfig] =
    useState<SeasonalThemeConfig>(() =>
      getStoredPreference<SeasonalThemeConfig>("seasonalThemeConfig", {
        name: null,
        isActive: false,
        startDate: "",
        endDate: "",
      })
    );

  const [previewThemeId, setPreviewThemeId] = useState<Theme | null>(null);

  const [platformThemes, setPlatformThemes] = useState<ThemeConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch themes.json + backend themes
  useEffect(() => {
    const loadThemes = async () => {
      setIsLoading(true);
      try {
        const themes = await apiService.fetchPlatformThemes();
        setPlatformThemes(themes);
      } catch (err) {
        console.error("Failed to load themes:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadThemes();
  }, []);

  const setBaseThemeId = (themeId: Theme) => {
    localStorage.setItem("baseThemeId", JSON.stringify(themeId));
    setBaseThemeState(themeId);
  };

  const setIsB2BMode = (isB2B: boolean) => {
    localStorage.setItem("isB2BMode", JSON.stringify(isB2B));
    setB2BModeState(isB2B);
  };

  const activeThemeConfig = useMemo<ThemeConfiguration>(() => {
    if (isLoading || platformThemes.length === 0) {
      return FALLBACK_THEME_CONFIG;
    }

    if (previewThemeId) {
      return getThemeConfig(previewThemeId, platformThemes) || FALLBACK_THEME_CONFIG;
    }

    const now = new Date();
    const isScheduledActive =
      seasonalThemeConfig.isActive &&
      seasonalThemeConfig.name &&
      (!seasonalThemeConfig.startDate ||
        new Date(seasonalThemeConfig.startDate) <= now) &&
      (!seasonalThemeConfig.endDate ||
        new Date(seasonalThemeConfig.endDate) >= now);

    if (isScheduledActive && seasonalThemeConfig.name) {
      return (
        getThemeConfig(seasonalThemeConfig.name, platformThemes) ||
        FALLBACK_THEME_CONFIG
      );
    }

    if (isB2BMode) {
      return (
        getThemeConfig("wholesale", platformThemes) || FALLBACK_THEME_CONFIG
      );
    }

    return getThemeConfig(baseThemeId, platformThemes) || FALLBACK_THEME_CONFIG;
  }, [
    previewThemeId,
    seasonalThemeConfig,
    isB2BMode,
    baseThemeId,
    platformThemes,
    isLoading,
  ]);

  // 🔥 Inject CSS Variables into <style id="theme">
  useEffect(() => {
    if (!activeThemeConfig) return;

    const cssVars = Object.entries(activeThemeConfig.css || {}).map(
      ([key, value]) => `--${key}: ${value};`
    );

    let el = document.getElementById("theme") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "theme";
      document.head.appendChild(el);
    }

    el.innerHTML = `:root { ${cssVars.join(" ")} }`;
  }, [activeThemeConfig]);

  return (
    <ThemeContext.Provider
      value={{
        baseThemeId,
        setBaseThemeId,
        activeThemeConfig,
        availableThemes: getAvailableThemesMap(platformThemes),
        seasonalThemeConfig,
        setSeasonalThemeConfig: (config) => {
          localStorage.setItem("seasonalThemeConfig", JSON.stringify(config));
          setSeasonalThemeConfig(config);
        },
        isB2BMode,
        setIsB2BMode,
        previewThemeId,
        setPreviewThemeId,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
