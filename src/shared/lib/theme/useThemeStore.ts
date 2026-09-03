import { create } from 'zustand';

import { applyTheme, initialTheme, themeType } from '@/shared/lib/theme/theme';

interface ThemeStore {
    currentTheme: themeType;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
    currentTheme: initialTheme(),
    toggleTheme: () => {
        const current = get().currentTheme;
        if (current === 'dark') set({ currentTheme: 'light' });
        else set({ currentTheme: 'dark' });
        applyTheme(get().currentTheme);
        localStorage.setItem('theme', get().currentTheme);
    },
}));
