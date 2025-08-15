import { useState, useEffect } from 'react';

export const usePencilMode = (): boolean => {
    const [isPencilActive, setIsPencilActive] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT') return;
            if (e.code === 'Space' && !e.repeat) {
                setIsPencilActive(true);
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT') return;
            if (e.code === 'Space') {
                setIsPencilActive(false);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    
    return isPencilActive;
};
