import React from 'react';

export const ZoomPrompt: React.FC = () => (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white py-2 px-4 rounded-lg shadow-lg z-[1000] pointer-events-none">
        <p className="text-center font-semibold">Click the map for pixel info. Zoom in to paint.</p>
    </div>
);
