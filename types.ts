import { LatLng } from 'leaflet';

export type PixelData = Map<string, string>;

export type Tool = 'PAINT' | 'ERASER' | 'PICKER' | null;

export interface PopupInfo {
    key: string;
    latlng: LatLng;
    color?: string;
    coords: { x: number, y: number } | null;
    geo: { lat: number, lng: number };
}