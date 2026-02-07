import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Simple Theme Setup
export const Colors = {
    dark: {
        background: '#0f172a',
        card: '#1e293b',
        text: '#f8fafc',
        textSecondary: '#94a3b8',
        primary: '#6366f1',
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#eab308',
        highlight: 'rgba(99, 102, 241, 0.2)',
    },
    light: {
        background: '#f1f5f9',
        card: '#ffffff',
        text: '#0f172a',
        textSecondary: '#64748b',
        primary: '#4f46e5',
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#ca8a04',
        highlight: 'rgba(79, 70, 229, 0.1)',
    }
};

type ContextType = {
    isDark: boolean;
    colors: typeof Colors.dark;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemScheme === 'dark');

    // Sync with system initially, but allow toggle
    useEffect(() => {
        setIsDark(systemScheme === 'dark');
    }, [systemScheme]);

    const toggleTheme = () => setIsDark(prev => !prev);

    const colors = isDark ? Colors.dark : Colors.light;

    return (
        <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};
