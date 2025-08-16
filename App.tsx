import React, { useState, useCallback } from "react";
import { PixelData, Tool, PopupInfo } from "./types";
import { COLORS, GRID_ZOOM_THRESHOLD, MAX_PAINT_CAN } from "./constants";
import { MapComponent } from "./components/map/MapComponent";
import { Palette } from "./components/Palette";
import { Toolbar } from "./components/Toolbar";
import { Tools } from "./components/Tools";
import { InfoModal } from "./components/InfoModal";
import { ZoomPrompt } from "./components/ZoomPrompt";
import { usePixelData } from "./hooks/usePixelData";
import { useColorHistory } from "./hooks/useColorHistory";
import { usePaintCan } from "./hooks/usePaintCan";
import { usePencilMode } from "./hooks/usePencilMode";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { latLngToWorldXY } from "./lib/coords";
import { LatLng } from "leaflet";

const App: React.FC = () => {
  const [pixels, setPixels] = usePixelData();
  const [colorHistory, updateColorHistory] = useColorHistory();
  const [paintCan, setPaintCan] = usePaintCan();
  const isPencilActive = usePencilMode();

  const [selectedColor, setSelectedColor] = useState<string>(COLORS[5]);
  const [zoom, setZoom] = useState<number>(4);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [isGridVisible, setIsGridVisible] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  const [isTouchDevice] = useState(
    "ontouchstart" in window || navigator.maxTouchPoints > 0
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedColor(color);
      setActiveTool("PAINT");
      updateColorHistory(color);
    },
    [updateColorHistory]
  );

  const handleToolSelect = useCallback(
    (tool: "PAINT" | "ERASER" | "PICKER") => {
      setPopupInfo(null); // Close the popup when a tool is selected
      setActiveTool((prev) => (prev === tool ? null : tool));
    },
    []
  );

  const handlePlacePixel = useCallback(
    (key: string) => {
      if (paintCan <= 0 || pixels.get(key) === selectedColor) return;

      setPixels((prev) => new Map(prev).set(key, selectedColor));
      setPaintCan((prev) => prev - 1);
      updateColorHistory(selectedColor);
    },
    [
      paintCan,
      selectedColor,
      pixels,
      setPixels,
      setPaintCan,
      updateColorHistory,
    ]
  );

  const handleErasePixel = useCallback(
    (key: string) => {
      if (!pixels.has(key)) return;
      setPixels((prev) => {
        const newPixels = new Map(prev);
        newPixels.delete(key);
        return newPixels;
      });
    },
    [pixels, setPixels]
  );

  const handlePickColor = useCallback(
    (key: string) => {
      const pickedColor = pixels.get(key);
      if (pickedColor) {
        handleColorSelect(pickedColor);
      }
    },
    [pixels, handleColorSelect]
  );

  const toggleGrid = useCallback(() => setIsGridVisible((prev) => !prev), []);
  const toggleInfoModal = useCallback(
    () => setIsInfoModalOpen((prev) => !prev),
    []
  );
  const toggleColorPicker = useCallback(
    () => setIsColorPickerOpen((prev) => !prev),
    []
  );

  // --- Popup Handlers ---
  const handleShowPopup = useCallback(
    (latlng: LatLng) => {
      const coords = latLngToWorldXY(latlng.lat, latlng.lng);
      const key = coords ? `${coords.x}_${coords.y}` : "";
      const color = pixels.get(key);
      setPopupInfo({
        key,
        latlng,
        color,
        coords,
        geo: { lat: latlng.lat, lng: latlng.lng },
      });
    },
    [pixels]
  );

  const handleClosePopup = useCallback(() => {
    setPopupInfo(null);
  }, []);

  const handleShareFromPopup = useCallback(
    (latlng: LatLng) => {
      const shareZoom = Math.max(zoom, 18);
      const url = `${window.location.origin}${
        window.location.pathname
      }?lat=${latlng.lat.toFixed(6)}&lng=${latlng.lng.toFixed(
        6
      )}&zoom=${shareZoom}`;
      navigator.clipboard.writeText(url);
      // In a real app, you'd show a toast notification here
      alert("Link copied to clipboard!");
      handleClosePopup();
    },
    [zoom, handleClosePopup]
  );

  useKeyboardShortcuts({
    isInfoModalOpen,
    zoom,
    handleToolSelect,
    toggleGrid,
    toggleInfoModal,
    toggleColorPicker,
  });

  return (
    <div className="bg-gray-900 text-white font-sans h-screen w-screen overflow-hidden relative">
      <MapComponent
        pixels={pixels}
        handlePlacePixel={handlePlacePixel}
        handleErasePixel={handleErasePixel}
        handlePickColor={handlePickColor}
        onZoomChange={setZoom}
        isGridVisible={isGridVisible}
        activeTool={activeTool}
        selectedColor={selectedColor}
        isPencilActive={isPencilActive}
        isTouchDevice={isTouchDevice}
        onShowPopup={handleShowPopup}
        popupInfo={popupInfo}
        onClosePopup={handleClosePopup}
        onShareFromPopup={handleShareFromPopup}
      />

      <Toolbar
        isGridVisible={isGridVisible}
        onToggleGrid={toggleGrid}
        onShowInfo={() => setIsInfoModalOpen(true)}
      />

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {zoom < GRID_ZOOM_THRESHOLD && <ZoomPrompt />}

      {zoom >= GRID_ZOOM_THRESHOLD && (
        <>
          <Tools activeTool={activeTool} onToolSelect={handleToolSelect} />
          <Palette
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
            paintCount={paintCan}
            maxPaintCan={MAX_PAINT_CAN}
            activeTool={activeTool}
            onToolSelect={handleToolSelect}
            colorHistory={colorHistory}
            isColorPickerOpen={isColorPickerOpen}
            onColorPickerToggle={setIsColorPickerOpen}
          />
        </>
      )}
    </div>
  );
};

export default App;
