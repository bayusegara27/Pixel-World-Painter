import { useEffect } from 'react';
import { GRID_ZOOM_THRESHOLD } from '../constants';
import { Tool } from '../types';

interface KeyboardShortcutsProps {
    isInfoModalOpen: boolean;
    zoom: number;
    handleToolSelect: (tool: 'PAINT' | 'ERASER' | 'PICKER') => void;
    toggleGrid: () => void;
    toggleInfoModal: () => void;
    toggleColorPicker: () => void;
}

export const useKeyboardShortcuts = (props: KeyboardShortcutsProps) => {
    const { isInfoModalOpen, zoom, handleToolSelect, toggleGrid, toggleInfoModal, toggleColorPicker } = props;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT') {
                return;
            }

            const key = e.key.toLowerCase();

            // Toggle Info Modal with 'i'
            if (key === 'i') {
                toggleInfoModal();
                e.preventDefault();
                return;
            }
            
            // If info modal is open, don't process other shortcuts
            if (isInfoModalOpen) {
                return;
            }

            switch(key) {
                case '1': handleToolSelect('PAINT'); break;
                case '2': handleToolSelect('ERASER'); break;
                case '3': handleToolSelect('PICKER'); break;
                case '4': 
                    if (zoom >= GRID_ZOOM_THRESHOLD) {
                        toggleColorPicker();
                    }
                    break;
                case 'g':
                    toggleGrid();
                    e.preventDefault();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isInfoModalOpen, zoom, handleToolSelect, toggleGrid, toggleInfoModal, toggleColorPicker]);
};
