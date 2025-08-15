import React from 'react';
import { COLORS } from '../constants';
import { Tool } from '../types';
import { ColorWheelIcon } from './Icons';

interface ColorButtonProps {
  color: string;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  activeTool: Tool | null;
}

const ColorButton: React.FC<ColorButtonProps> = ({ color, selectedColor, onColorSelect, activeTool }) => (
  <button
    onClick={(e) => {
      onColorSelect(color);
      e.currentTarget.blur();
    }}
    className={`w-8 h-8 rounded-full transition-all duration-150 ease-in-out border-2 border-transparent ${
      selectedColor === color && activeTool === 'PAINT' ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white scale-110' : 'hover:scale-110'
    }`}
    style={{ backgroundColor: color }}
    aria-label={`Select color ${color}`}
  />
);


interface ColorPaletteGridProps {
  isMobile: boolean;
  colorHistory: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  activeTool: Tool | null;
  onOpenPicker: () => void;
}

export const ColorPaletteGrid: React.FC<ColorPaletteGridProps> = ({ 
  isMobile, colorHistory, selectedColor, onColorSelect, activeTool, onOpenPicker 
}) => {
  const commonProps = { selectedColor, onColorSelect, activeTool };

  if (isMobile) {
    return (
      <div className='flex flex-col gap-3'>
        {colorHistory.length > 0 && (
          <div>
            <h3 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 px-1">History</h3>
            <div className="grid grid-cols-8 gap-2">
              {colorHistory.map(color => <ColorButton key={`hist-mob-${color}`} color={color} {...commonProps} />)}
            </div>
          </div>
        )}
        <div>
           <h3 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 px-1">Palette</h3>
          <div className="grid grid-cols-8 gap-2">
            {COLORS.map(color => <ColorButton key={`pal-mob-${color}`} color={color} {...commonProps} />)}
            <div className="relative">
              <button
                onClick={(e) => { onOpenPicker(); e.currentTarget.blur(); }}
                className="w-8 h-8 rounded-full transition-all duration-150 ease-in-out bg-gray-700/60 flex items-center justify-center text-gray-300 hover:bg-gray-600/80 hover:scale-110"
                aria-label="Open custom color picker (Shortcut: 4)"
              >
                <ColorWheelIcon className="w-5 h-5" />
              </button>
              <kbd className="absolute -top-1 -right-1 text-[10px] font-mono bg-gray-900/80 text-gray-300 px-1.5 py-0.5 rounded-md pointer-events-none">4</kbd>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <>
      {colorHistory.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs text-gray-400 font-bold uppercase tracking-wider px-1 text-center">History</h3>
          <div className="flex items-center gap-2 justify-center flex-wrap">
            {colorHistory.map(color => <ColorButton key={`hist-desk-${color}`} color={color} {...commonProps} />)}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {colorHistory.length > 0 && <h3 className="text-xs text-gray-400 font-bold uppercase tracking-wider px-1 text-center">Palette</h3>}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {COLORS.map(color => <ColorButton key={`pal-desk-${color}`} color={color} {...commonProps} />)}
          <div className="relative">
            <button
              onClick={(e) => { onOpenPicker(); e.currentTarget.blur(); }}
              className="w-8 h-8 rounded-full transition-all duration-150 ease-in-out bg-gray-700/60 flex items-center justify-center text-gray-300 hover:bg-gray-600/80 hover:scale-110"
              aria-label="Open custom color picker (Shortcut: 4)"
            >
              <ColorWheelIcon className="w-5 h-5" />
            </button>
            <kbd className="absolute -top-1 -right-1 text-[10px] font-mono bg-gray-900/80 text-gray-300 px-1.5 py-0.5 rounded-md pointer-events-none">4</kbd>
          </div>
        </div>
      </div>
    </>
  );
};