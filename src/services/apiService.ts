import { MOCK_THEME_CONFIGURATIONS } from "../data/themes";
import { ThemeConfiguration } from "../types";

// Minimal mock API only for themes until backend route is ready.
export const apiService = {
  fetchPlatformThemes: async (): Promise<ThemeConfiguration[]> => {
    return Promise.resolve(MOCK_THEME_CONFIGURATIONS);
  },
};
