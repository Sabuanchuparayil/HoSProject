import { Theme } from '../types';

type ThemeDefaults = {
    [key in Theme]?: {
        '--bg-primary': string;
        '--bg-secondary': string;
        '--text-primary': string;
        '--accent': string;
    }
}

export const THEME_DEFAULTS: ThemeDefaults = {
    dark: {
        '--bg-primary': '#111827',
        '--bg-secondary': '#1F2937',
        '--text-primary': '#F9FAFB',
        '--accent': '#FBBF24',
    },
    light: {
        '--bg-primary': '#F3F4F6',
        '--bg-secondary': '#FFFFFF',
        '--text-primary': '#111827',
        '--accent': '#7E22CE',
    },
    gryffindor: {
        '--bg-primary': '#2c0101',
        '--bg-secondary': '#4a0202',
        '--text-primary': '#f0c370',
        '--accent': '#ae0001',
    },
    slytherin: {
        '--bg-primary': '#041f10',
        '--bg-secondary': '#0a2a12',
        '--text-primary': '#c0c0c0',
        '--accent': '#1a472a',
    },
    ollivanders: {
        '--bg-primary': '#2a211b',
        '--bg-secondary': '#3e3229',
        '--text-primary': '#e0dcd5',
        '--accent': '#a88763',
    },
    gringotts: {
        '--bg-primary': '#f8f5f0',
        '--bg-secondary': '#ffffff',
        '--text-primary': '#1f1a11',
        '--accent': '#a58238',
    },
    wholesale: {
        '--bg-primary': '#eef2f6',
        '--bg-secondary': '#ffffff',
        '--text-primary': '#1e293b',
        '--accent': '#2563eb',
    },
    halloween: {
        '--bg-primary': '#0d0d0d',
        '--bg-secondary': '#1a1a1a',
        '--text-primary': '#f8f8f8',
        '--accent': '#ff7518',
    },
    winter: {
        '--bg-primary': '#f0f4f8',
        '--bg-secondary': '#ffffff',
        '--text-primary': '#2c3e50',
        '--accent': '#3498db',
    },
};