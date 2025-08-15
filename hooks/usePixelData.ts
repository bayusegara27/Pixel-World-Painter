import { useState, useEffect } from 'react';
import { PixelData } from '../types';

const PIXEL_DATA_STORAGE_KEY = 'pixelWorldPainterData';

export const usePixelData = (): [PixelData, React.Dispatch<React.SetStateAction<PixelData>>] => {
    const [pixels, setPixels] = useState<PixelData>(() => {
        try {
            const savedData = localStorage.getItem(PIXEL_DATA_STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                return new Map(parsedData);
            }
        } catch (error) {
            console.error("Failed to load pixel data from localStorage", error);
        }
        return new Map<string, string>();
    });

    useEffect(() => {
        try {
            const dataToSave = JSON.stringify(Array.from(pixels.entries()));
            localStorage.setItem(PIXEL_DATA_STORAGE_KEY, dataToSave);
        } catch (error) {
            console.error("Failed to save pixel data to localStorage", error);
        }
    }, [pixels]);

    return [pixels, setPixels];
};
