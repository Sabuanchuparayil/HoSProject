import { ThemeConfiguration, Theme } from '../types';

export const getThemeConfig = (
  themeId: Theme,
  allThemes: ThemeConfiguration[]
): ThemeConfiguration | undefined =>
  allThemes.find((t) => t.id === themeId);

export const getAvailableThemesMap = (
  allThemes: ThemeConfiguration[]
): Record<string, string> =>
  Object.fromEntries(allThemes.map((t) => [t.id, t.name]));
