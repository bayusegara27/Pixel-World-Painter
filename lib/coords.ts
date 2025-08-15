import L from 'leaflet';
import { WORLD_PIXEL_DIMENSION } from '../constants';

const TILE_SIZE = 256;

/**
 * Converts geographic coordinates (Latitude, Longitude) to the global fixed-grid pixel coordinates (X, Y).
 * This uses the Web Mercator projection formula.
 */
export const latLngToWorldXY = (lat: number, lng: number): { x: number; y: number } | null => {
    // Normalize longitude to -180 to 180 to handle map wrapping
    let normLng = lng;
    while(normLng > 180) normLng -= 360;
    while(normLng < -180) normLng += 360;

    const latRad = lat * Math.PI / 180;
    // Using the standard Web Mercator projection formula
    const x = Math.floor(((normLng + 180) / 360) * WORLD_PIXEL_DIMENSION);
    const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * WORLD_PIXEL_DIMENSION);
    
    if (x < 0 || x >= WORLD_PIXEL_DIMENSION || y < 0 || y >= WORLD_PIXEL_DIMENSION) {
        return null;
    }
    return { x, y };
};

/**
 * Converts a global fixed-grid pixel coordinate (X, Y) to the LatLng of its top-left corner.
 */
export const worldXYToLatLng = (x: number, y: number): { lat: number, lng: number } => {
    const lng = (x / WORLD_PIXEL_DIMENSION) * 360 - 180;
    const n = Math.PI - (2 * Math.PI * y) / WORLD_PIXEL_DIMENSION;
    const latRad = Math.atan(Math.sinh(n));
    const lat = latRad * 180 / Math.PI;
    return { lat, lng };
};

/**
 * Gets the geographic boundaries of a single pixel from its (X, Y) coordinates.
 */
export const worldXYToLatLngBounds = (x: number, y: number): L.LatLngBounds => {
    const nw = worldXYToLatLng(x, y);
    const se = worldXYToLatLng(x + 1, y + 1);
    // Leaflet's LatLngBounds constructor is (southWest, northEast)
    return L.latLngBounds(L.latLng(se.lat, nw.lng), L.latLng(nw.lat, se.lng));
};

/**
 * Converts global pixel coordinates into tile and in-tile pixel coordinates.
 */
export const worldXYToTileXY = (x: number, y: number) => {
    if (x < 0 || y < 0) return null;
    return {
        tileX: Math.floor(x / TILE_SIZE),
        tileY: Math.floor(y / TILE_SIZE),
        pixelX: x % TILE_SIZE,
        pixelY: y % TILE_SIZE,
    };
};