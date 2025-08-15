import React from 'react';
import { GridOnIcon, GridOffIcon, InfoIcon } from './Icons';

interface ToolbarProps {
  isGridVisible: boolean;
  onToggleGrid: () => void;
  onShowInfo: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ isGridVisible, onToggleGrid, onShowInfo }) => {
  return (
    <div className="fixed top-4 right-4 z-[1000] flex gap-2">
      <button
        onClick={(e) => {
          onShowInfo();
          e.currentTarget.blur();
        }}
        className="relative bg-gray-800/80 backdrop-blur-md text-white rounded-lg p-3 shadow-lg hover:bg-gray-700/90 transition-colors"
        aria-label="Show info (Shortcut: i)"
      >
        <InfoIcon className="w-6 h-6" />
        <kbd className="absolute top-1 right-1.5 text-[10px] font-mono bg-black/20 text-gray-300 px-1.5 rounded">i</kbd>
      </button>
      <button
        onClick={(e) => {
          onToggleGrid();
          e.currentTarget.blur();
        }}
        className="relative bg-gray-800/80 backdrop-blur-md text-white rounded-lg p-3 shadow-lg hover:bg-gray-700/90 transition-colors"
        aria-label={isGridVisible ? 'Hide grid (Shortcut: g)' : 'Show grid (Shortcut: g)'}
      >
        {isGridVisible ? <GridOnIcon className="w-6 h-6" /> : <GridOffIcon className="w-6 h-6" />}
        <kbd className="absolute top-1 right-1.5 text-[10px] font-mono bg-black/20 text-gray-300 px-1.5 rounded">g</kbd>
      </button>
    </div>
  );
};