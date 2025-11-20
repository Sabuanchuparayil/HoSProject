import { Theme } from '../types';

const STYLE_TAG_PREFIX = 'theme-style-';

/**
 * Injects CSS rules for a custom theme into a <style> tag in the document's head.
 * If a style tag for this theme already exists, it will be updated.
 * @param themeId The unique identifier for the theme.
 * @param cssContent The string content of the CSS file.
 */
export const injectThemeStyles = (themeId: Theme, cssContent: string) => {
    const styleId = `${STYLE_TAG_PREFIX}${themeId}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
    }

    // The CSS content from the file is expected to be a ruleset like:
    // :root { --bg-primary: #...; }
    // We need to transform it to target the theme's class.
    const themedCssContent = cssContent.replace(/:root/g, `.theme-${themeId}`);
    
    styleElement.innerHTML = themedCssContent;
};

/**
 * Removes a specific theme's injected <style> tag from the document's head.
 * @param themeId The unique identifier for the theme.
 */
export const removeThemeStyles = (themeId: Theme) => {
    const styleId = `${STYLE_TAG_PREFIX}${themeId}`;
    const styleElement = document.getElementById(styleId);
    if (styleElement) {
        styleElement.remove();
    }
};

/**
 * Removes all dynamically injected theme style tags. Useful for cleanup.
 */
export const removeAllInjectedStyles = () => {
    const styleTags = document.querySelectorAll<HTMLStyleElement>(`[id^="${STYLE_TAG_PREFIX}"]`);
    styleTags.forEach(tag => tag.remove());
};