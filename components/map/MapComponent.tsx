import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  ZoomControl,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import { PixelData, Tool, PopupInfo } from "../../types";
import {
  INITIAL_CENTER,
  INITIAL_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
} from "../../constants";
import { PixelCanvasLayer } from "./PixelCanvasLayer";
import { PixelInfoPopup } from "../PixelInfoPopup";

/**
 * A simple component that forces the map to re-evaluate its size after mounting.
 * This fixes a common issue where Leaflet maps don't render tiles correctly on
 * initial load because the container's size isn't immediately available.
 */
const MapResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [map]);
  return null;
};

/**
 * Handles reading URL parameters on initial load to center the map.
 */
const MapUrlHandler: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get("lat");
    const lng = params.get("lng");
    const zoom = params.get("zoom");
    if (lat && lng && zoom) {
      map.setView([parseFloat(lat), parseFloat(lng)], parseInt(zoom, 10));
    }
  }, [map]);
  return null;
};

interface PixelCanvasLayerWrapperProps {
  pixels: PixelData;
  onPlacePixel: (key: string) => void;
  onErasePixel: (key: string) => void;
  onPickColor: (key: string) => void;
  onZoomChange: (zoom: number) => void;
  isGridVisible: boolean;
  activeTool: Tool | null;
  selectedColor: string;
  isPencilActive: boolean;
  isTouchDevice: boolean;
  onShowPopup: (latlng: L.LatLng) => void;
}

const PixelCanvasLayerWrapper: React.FC<PixelCanvasLayerWrapperProps> = (
  props
) => {
  const map = useMap();
  const layerRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    layerRef.current = new PixelCanvasLayer(props);
    layerRef.current.addTo(map);
    return () => {
      if (layerRef.current) layerRef.current.remove();
    };
  }, [map]);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.setProps(props);
    }
  }, [props]);

  return null;
};

interface MapComponentProps {
  pixels: PixelData;
  handlePlacePixel: (key: string) => void;
  handleErasePixel: (key: string) => void;
  handlePickColor: (key: string) => void;
  onZoomChange: (zoom: number) => void;
  isGridVisible: boolean;
  activeTool: Tool | null;
  selectedColor: string;
  isPencilActive: boolean;
  isTouchDevice: boolean;
  onShowPopup: (latlng: L.LatLng) => void;
  popupInfo: PopupInfo | null;
  onClosePopup: () => void;
  onShareFromPopup: (latlng: L.LatLng) => void;
}

export const MapComponent: React.FC<MapComponentProps> = (props) => {
  return (
    <div className="h-screen w-screen absolute top-0 left-0 z-0">
      <MapContainer
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        worldCopyJump={false} // Let the layer handle wrapped world rendering
        doubleClickZoom={false}
        zoomSnap={0.1}
        zoomDelta={0.25}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />
        <ZoomControl position="topleft" />
        <MapResizeHandler />
        <MapUrlHandler />
        <PixelCanvasLayerWrapper
          pixels={props.pixels}
          onPlacePixel={props.handlePlacePixel}
          onErasePixel={props.handleErasePixel}
          onPickColor={props.handlePickColor}
          onZoomChange={props.onZoomChange}
          isGridVisible={props.isGridVisible}
          activeTool={props.activeTool}
          selectedColor={props.selectedColor}
          isPencilActive={props.isPencilActive}
          isTouchDevice={props.isTouchDevice}
          onShowPopup={props.onShowPopup}
        />
        {props.popupInfo && (
          <Popup
            position={props.popupInfo.latlng}
            eventHandlers={{ remove: props.onClosePopup }}
            className="custom-pixel-popup"
          >
            <PixelInfoPopup
              info={props.popupInfo}
              onShare={props.onShareFromPopup}
            />
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};
