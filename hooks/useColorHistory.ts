import { useState, useEffect } from 'react';
import { HISTORY_PALETTE_SIZE } from '../constants';

const COLOR_HISTORY_STORAGE_KEY = 'pixelWorldPainterColorHistory';

type UpdateColorHistoryFn = (newColor: string) => void;

export const useColorHistory = (): [string[], UpdateColorHistoryFn] => {
    const [colorHistory, setColorHistory] = useState<string[]>(() => {
        try {
            const savedHistory = localStorage.getItem(COLOR_HISTORY_STORAGE_KEY);
            return savedHistory ? JSON.parse(savedHistory) : [];
        } catch (error) {
            console.error("Failed to load color history from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(COLOR_HISTORY_STORAGE_KEY, JSON.stringify(colorHistory));
        } catch (error) {
            console.error("Failed to save color history to localStorage", error);
        }
    }, [colorHistory]);

    const updateColorHistory = (newColor: string) => {
        setColorHistory(prev => {
            const newHistory = [newColor, ...prev.filter(c => c.toLowerCase() !== newColor.toLowerCase())];
            return newHistory.slice(0, HISTORY_PALETTE_SIZE);
        });
    };

    return [colorHistory, updateColorHistory];
};
