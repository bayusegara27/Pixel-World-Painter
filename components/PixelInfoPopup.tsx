import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { PopupInfo } from '../../types';
import { LocationMarkerIcon, ShareIcon } from './Icons';
import { worldXYToTileXY } from '../lib/coords';


interface PixelInfoPopupProps {
    info: PopupInfo;
    onShare: (latlng: L.LatLng) => void;
}

export const PixelInfoPopup: React.FC<PixelInfoPopupProps> = ({ info, onShare }) => {
    const { color, coords, geo } = info;
    const isPainted = !!color;
    const [locationName, setLocationName] = useState('Loading location...');

    useEffect(() => {
        if (!geo) return;
        
        let isMounted = true;
        setLocationName('Loading location...');

        // Using Nominatim for reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${geo.lat}&lon=${geo.lng}&zoom=10`)
            .then(res => res.json())
            .then(data => {
                if (isMounted) {
                    if (data && data.address) {
                        const { address } = data;
                        const name = address?.city || address?.town || address?.village || address?.county || address?.state || data.display_name?.split(',').pop()?.trim() || 'Unknown Location';
                        setLocationName(name);
                    } else {
                        setLocationName("Ocean");
                    }
                }
            })
            .catch(() => {
                if (isMounted) {
                    setLocationName('Could not fetch location');
                }
            });
        
        return () => { isMounted = false; };
    }, [geo]);

    const tileCoords = coords ? worldXYToTileXY(coords.x, coords.y) : null;

    return (
        <div className="w-64 bg-gray-800/80 backdrop-blur-md text-white rounded-xl shadow-2xl font-sans overflow-hidden flex flex-col">
            {/* Main Info Area */}
            <div className="p-3">
                <div className="flex items-start gap-3 mb-3">
                    <LocationMarkerIcon className="w-6 h-6 text-teal-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-base leading-tight text-white">
                            {coords ? `Pixel ${coords.x}, ${coords.y}` : "Out of Bounds"}
                        </h3>
                        <p className="text-sm text-gray-400 font-semibold">{locationName}</p>
                    </div>
                </div>

                {tileCoords && (
                    <div className="text-center text-xs text-gray-400 font-mono bg-gray-900/50 p-1 rounded">
                        TI(X: {tileCoords.tileX}, Y: {tileCoords.tileY}) Px(X: {tileCoords.pixelX}, Y: {tileCoords.pixelY})
                    </div>
                )}
            </div>

            {/* Footer / Action Bar */}
            <div className="p-3 mt-auto bg-gray-900/40 border-t border-gray-700/50 flex items-center justify-between gap-3">
                {/* Left Side: Color Info */}
                <div>
                    {isPainted ? (
                        <div className="flex items-center gap-2">
                           <div className="w-5 h-5 rounded-sm border border-gray-600 shadow-inner" style={{ backgroundColor: color }}></div>
                           <span className="font-mono text-gray-200 font-semibold">{color.toUpperCase()}</span>
                        </div>
                    ) : (
                        <p className="text-gray-400 font-semibold text-sm">Not Painted</p>
                    )}
                </div>

                {/* Right Side: Share Button */}
                <button
                    onClick={() => onShare(info.latlng)}
                    className="flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-700/60 text-gray-200 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-600/80"
                >
                    <ShareIcon className="w-4 h-4" />
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
};