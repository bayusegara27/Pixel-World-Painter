
export const COLORS = [
  '#ffffff', '#e4e4e4', '#888888', '#222222', '#ffa7d1', '#e50000',
  '#e59500', '#a06a42', '#e5d900', '#94e044', '#02be01', '#00d3dd',
  '#0083c7', '#0000ea', '#cf6ee4', '#820080'
];

export const HISTORY_PALETTE_SIZE = 8;

export const INITIAL_CENTER: [number, number] = [48.8566, 2.3522]; // Paris
export const INITIAL_ZOOM = 4;
export const MIN_ZOOM = 3;
export const MAX_ZOOM = 30;

// The total number of pixels horizontally and vertically for the world canvas.
export const WORLD_PIXEL_DIMENSION = 1300000;

// Pixels are visible from this zoom level onwards
export const PIXEL_VISIBILITY_ZOOM_THRESHOLD = 4; 
// The grid appears and painting is enabled from this zoom level onwards
export const GRID_ZOOM_THRESHOLD = 12;

export const MAX_PAINT_CAN = 500;
export const REFILL_AMOUNT = 1;
export const REFILL_INTERVAL_MS = 1500; // 1.5 seconds