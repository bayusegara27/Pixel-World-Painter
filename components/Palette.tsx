import React, { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { PaintBrushIcon, EraserIcon, EyedropperIcon } from './Icons';
import { Tool } from '../types';
import { ColorPaletteGrid } from './ColorPaletteGrid';

interface PaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  paintCount: number;
  maxPaintCan: number;
  activeTool: Tool | null;
  onToolSelect: (tool: 'PAINT' | 'ERASER' | 'PICKER') => void;
  colorHistory: string[];
  isColorPickerOpen: boolean;
  onColorPickerToggle: (isOpen: boolean) => void;
}

// ToolButton for mobile view
const ToolButton: React.FC<{
  label: string;
  tool: 'PAINT' | 'ERASER' | 'PICKER';
  activeTool: Tool | null;
  onToolSelect: (tool: 'PAINT' | 'ERASER' | 'PICKER') => void;
  children: React.ReactNode;
  shortcut: string;
}> = ({ label, tool, activeTool, onToolSelect, children, shortcut }) => (
  <button
    onClick={(e) => {
      onToolSelect(tool);
      e.currentTarget.blur();
    }}
    className={`relative flex-1 flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
      activeTool === tool ? 'bg-teal-500 text-white' : 'bg-gray-600/50 hover:bg-gray-500/50 text-gray-300'
    }`}
    aria-label={`Select ${label} tool (Shortcut: ${shortcut})`}
  >
    {children}
    <span className="text-xs font-semibold mt-1">{label}</span>
    <kbd className="absolute top-1 right-1.5 text-[10px] font-mono bg-black/20 text-gray-300 px-1 rounded">{shortcut}</kbd>
  </button>
);

export const Palette: React.FC<PaletteProps> = ({
  selectedColor, onColorSelect, paintCount, maxPaintCan, activeTool, onToolSelect, colorHistory, isColorPickerOpen, onColorPickerToggle
}) => {
  const [pickerColor, setPickerColor] = useState(selectedColor);
  const paintPercentage = Math.round((paintCount / maxPaintCan) * 100);

  useEffect(() => {
    // Keep picker color in sync if the global color changes while picker is closed
    if (!isColorPickerOpen) {
      setPickerColor(selectedColor);
    }
  }, [selectedColor, isColorPickerOpen]);

  const handleOpenPicker = () => {
    setPickerColor(selectedColor); // Initialize picker with current color
    onColorPickerToggle(true);
  };
  
  const handleCancelPicker = () => {
    onColorPickerToggle(false);
  };
  
  const handleConfirmPicker = () => {
    onColorSelect(pickerColor); // Finalize color selection
    onColorPickerToggle(false);
  };


  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex justify-center pointer-events-none px-4 w-full md:w-auto">
      <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/30 transition-all duration-300 ease-in-out pointer-events-auto w-full max-w-xs md:max-w-xl relative">
        
        {isColorPickerOpen && (
            <div className="absolute bottom-full mb-3 flex flex-col gap-2 w-full">
                <div className="p-2 bg-gray-700 rounded-lg shadow-xl">
                    <HexColorPicker style={{width: '100%', height: '150px'}} color={pickerColor} onChange={setPickerColor} />
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={(e) => { handleCancelPicker(); e.currentTarget.blur(); }} className="px-4 py-1.5 rounded-lg bg-gray-500/80 text-white font-semibold text-sm hover:bg-gray-500/100 transition-colors">
                        Cancel
                    </button>
                    <button onClick={(e) => { handleConfirmPicker(); e.currentTarget.blur(); }} className="px-4 py-1.5 rounded-lg bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition-colors">
                        OK
                    </button>
                </div>
            </div>
        )}

        <div className="p-3 flex flex-col gap-3">
          {/* --- MOBILE VIEW --- */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="bg-gray-900/50 rounded-lg p-2 flex items-center justify-between gap-2">
                <ToolButton label="Paint" tool="PAINT" activeTool={activeTool} onToolSelect={onToolSelect} shortcut="1">
                  <PaintBrushIcon className="w-6 h-6" />
                </ToolButton>
                <ToolButton label="Eraser" tool="ERASER" activeTool={activeTool} onToolSelect={onToolSelect} shortcut="2">
                  <EraserIcon className="w-6 h-6" />
                </ToolButton>
                 <ToolButton label="Picker" tool="PICKER" activeTool={activeTool} onToolSelect={onToolSelect} shortcut="3">
                  <EyedropperIcon className="w-6 h-6" />
                </ToolButton>
            </div>

            {(activeTool === 'PAINT') && (
              <ColorPaletteGrid 
                isMobile={true}
                colorHistory={colorHistory}
                selectedColor={selectedColor}
                onColorSelect={onColorSelect}
                activeTool={activeTool}
                onOpenPicker={handleOpenPicker}
              />
            )}
          </div>
          
          {/* --- DESKTOP VIEW (Colors Only) --- */}
          <div className="hidden md:flex flex-col gap-3">
             {(activeTool === 'PAINT') && (
                <ColorPaletteGrid 
                  isMobile={false}
                  colorHistory={colorHistory}
                  selectedColor={selectedColor}
                  onColorSelect={onColorSelect}
                  activeTool={activeTool}
                  onOpenPicker={handleOpenPicker}
                />
             )}
          </div>

          <div className="h-4 bg-gray-900/50 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-teal-500 transition-all duration-500 ease-out" style={{ width: `${paintPercentage}%` }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-white mix-blend-overlay">{paintCount}/{maxPaintCan}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};