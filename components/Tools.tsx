import React from 'react';
import { PaintBrushIcon, EraserIcon, EyedropperIcon } from './Icons';
import { Tool } from '../types';

interface ToolButtonProps {
  label: string;
  tool: 'PAINT' | 'ERASER' | 'PICKER';
  activeTool: Tool | null;
  onToolSelect: (tool: 'PAINT' | 'ERASER' | 'PICKER') => void;
  children: React.ReactNode;
  shortcut: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({ label, tool, activeTool, onToolSelect, children, shortcut }) => (
  <button
    onClick={(e) => {
      onToolSelect(tool);
      e.currentTarget.blur();
    }}
    className={`relative flex flex-col items-center justify-center p-3 rounded-lg transition-colors w-full ${
      activeTool === tool ? 'bg-teal-500 text-white' : 'bg-gray-600/50 hover:bg-gray-500/50 text-gray-300'
    }`}
    aria-label={`Select ${label} tool (Shortcut: ${shortcut})`}
    title={label} // Tooltip for desktop
  >
    {children}
    <kbd className="absolute top-1 right-1.5 text-[10px] font-mono bg-black/20 text-gray-300 px-1 rounded">{shortcut}</kbd>
  </button>
);

interface ToolsProps {
    activeTool: Tool | null;
    onToolSelect: (tool: 'PAINT' | 'ERASER' | 'PICKER') => void;
}

export const Tools: React.FC<ToolsProps> = ({ activeTool, onToolSelect }) => {
    return (
        // Hidden on mobile, block on medium screens and up
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[1000] hidden md:block">
            <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/30 p-2 flex flex-col items-center gap-2">
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
        </div>
    )
}