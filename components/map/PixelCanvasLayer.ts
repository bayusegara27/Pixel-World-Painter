import L from "leaflet";
import { PixelData, Tool } from "../../types";
import {
  GRID_ZOOM_THRESHOLD,
  PIXEL_VISIBILITY_ZOOM_THRESHOLD,
  WORLD_PIXEL_DIMENSION,
} from "../../constants";
import { latLngToWorldXY, worldXYToLatLngBounds } from "../../lib/coords";

// --- Custom SVG Cursors (Base64 Encoded) ---
const CURSOR_PAINT_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjUiIGQ9Ik0xNS44MjUuMTJhLjUuNSAwIDAgMSAuMTMyLjU4NGMtMS41MyAzLjQzLTQuNzQ3IDguMTctNy4wOTUgMTAuNjRhNi4xIDYuMSAwIDAgMS0yLjM3MyAxLjUzNGMtLjAxOC4yMjctLjA2LjUzOC0uMTYuODY4LS4yMDEuNjU5LS4wNjcgMS40NzktMS43MDggMS43NGE4LjEgOC4xIDAgMCAxLTMuMDc4LjEzMiA0IDQgMCAwIDEtLjU2Mi0uMTM1IDEuNCAxLjQgMCAwIDEtLjQ2Ni0uMjQ3LjcuNyAwIDAgMS0uMjA0LS4yODguNjIuNjIgMCAwIDEgLjAwNC0uNDQzYy4wOTUtLjI0NS4zMTYtLjM4LjQ2MS0uNDUyLjM5NC0uMTk3LjYyNS0uNDUzLjg2Ny0uODI2LjA5NS0uMTQ0LjE4NC0u২৯Ny4yODctLjQ3MmwuMTE3LS4xOThjLjE1MS0uMjU1LjMyNi0uNTQuNTQ2LS44NDguNTI4LS43MzkgMS4yMDEtLjkI1IDEuNzQ2LS44OTZxLjE5LjAxMi4zNDguMDQ4Yy4wNjItLjE3Mi4xNDItLjM4LjIzOC0uNjA4LjI2MS0uNjE5LjY1OC0xLjQxOSAxLjE4Ny0yLjA2OSAyLjE3Ni0yLjY3IDYuMTgtNi4yMDYgOS4xMTctOC4xMDRhLjUuNSAwIDAgMSAuNTk2LjA0eiIvPjwvc3ZnPg==";
const CURSOR_ERASER_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjUiIGQ9Ik04LjA4NiAyLjIwN2EyIDIgMCAwIDEgMi44MjggMGwzLjg3OSAzLjg3OWEyIDIgMCAwIDEgMCAyLjgyOGwtNS41IDUuNUEyIDIgMCAwIDEgNy44NzkgMTVINS4xMmEyIDIgMCAwIDEtMS40MTQtLjU4NmwtMi41LTIuNWEyIDIgMCAwIDEgMC0yLjgyOGw1LjUtNS41eiIvPjwvc3ZnPg==";
const CURSOR_PICKER_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjUiIGQ9Ik0xMy4zNTQuNjQ2YTEuMjA3IDEuMjA3IDAgMCAwLTEuNzA4IDBMOC41IDMuNzkzbC0uNjQ2LS42NDdhLjUuNSAwIDEgMC0uNzA4LjcwOEw4LjI5MyA1bC03LjE0NyA3LjE0NkEuNS41IDAgMCAwIDEgMTIuNXYxLjc5M2wtLjg1NC44NTNhLjUuNSAwIDEgMCAuNzA4LjcwN0wxLjcwNyAxNUgzLjVhLjUuNSAwIDAgMCAuMzU0LS4xNDZMMTEgNy43MDdsMS4xNDYgMS4xNDdhLjUuNSAwIDAgMCAuNzA4LS43MDhsLS42NDctLjY0NiAzLjE0Ny0zLjE0NmExLjIwNyAxLjIwNyAwIDAgMCAwLTEuNzA4eiIvPjwvc3ZnPg==";

export const PixelCanvasLayer = L.Layer.extend({
  // @ts-ignore
  initialize: function (options) {
    L.setOptions(this, options);
  },

  // @ts-ignore
  onAdd: function (map) {
    this._map = map;
    this._canvas = L.DomUtil.create(
      "canvas",
      "leaflet-pixel-canvas leaflet-interactive leaflet-zoom-animated"
    );
    this.getPane().appendChild(this._canvas);

    const size = this._map.getSize();
    this._canvas.width = size.x;
    this._canvas.height = size.y;

    this._ctx = this._canvas.getContext("2d");

    map.on("move zoom", this._reset, this);
    map.on("moveend zoomend", this._reset, this);

    map.on("zoomend", this._onZoomEnd, this);
    map.on("mousemove", this._onMouseMove, this);
    map.on("click", this._onClick, this);
    map.on("mouseout", this._onMouseOut, this);

    this.options.onZoomChange(this._map.getZoom());
    this._updateCursorStyle(); // Initial cursor set
    this._reset();
  },

  // @ts-ignore
  onRemove: function (map) {
    L.DomUtil.remove(this._canvas);

    map.off("move zoom", this._reset, this);
    map.off("moveend zoomend", this._reset, this);

    map.off("zoomend", this._onZoomEnd, this);
    map.off("mousemove", this._onMouseMove, this);
    map.off("click", this._onClick, this);
    map.off("mouseout", this._onMouseOut, this);

    if (this._map.getContainer()) {
      this._map.getContainer().style.cursor = "";
    }
  },

  // @ts-ignore
  setProps(props) {
    const oldTool = this.options.activeTool;
    L.Util.setOptions(this, props);
    if (oldTool !== props.activeTool) {
      this._updateCursorStyle();
    }
    this._reset();
  },

  // @ts-ignore
  _onZoomEnd: function () {
    this.options.onZoomChange(this._map.getZoom());
    this._updateCursorStyle();
  },

  // @ts-ignore
  _onMouseOut: function () {
    if (this.options.mousePos !== null) {
      this.options.mousePos = null;
      this.options.hoveredPixelKey = null;
      this._reset();
    }
  },

  // @ts-ignore
  _onMouseMove: function (e) {
    const zoom = this._map.getZoom();
    if (zoom < GRID_ZOOM_THRESHOLD) {
      if (this.options.mousePos || this.options.hoveredPixelKey) {
        this.options.mousePos = null;
        this.options.hoveredPixelKey = null;
        this._reset();
      }
      return;
    }
    this.options.mousePos = e.containerPoint;
    this.options.hoveredPixelKey = this._snapLatLngToKey(e.latlng);

    if (this.options.isPencilActive) {
      const key = this.options.hoveredPixelKey;
      if (!key) return;
      if (this.options.activeTool === "PAINT") {
        this.options.onPlacePixel(key);
      } else if (this.options.activeTool === "ERASER") {
        this.options.onErasePixel(key);
      }
    }
    this._reset();
  },

  // @ts-ignore
  _onClick: function (e) {
    const canUseTools = this._map.getZoom() >= GRID_ZOOM_THRESHOLD;

    // If a tool is selected AND we are zoomed in enough to use it
    if (this.options.activeTool && canUseTools) {
      const key = this._snapLatLngToKey(e.latlng);
      if (!key) return;

      switch (this.options.activeTool) {
        case "PAINT":
          this.options.onPlacePixel(key);
          break;
        case "ERASER":
          this.options.onErasePixel(key);
          break;
        case "PICKER":
          this.options.onPickColor(key);
          break;
      }
    } else {
      // Otherwise (no tool active OR zoomed out), show the info popup
      this.options.onShowPopup(e.latlng);
    }
  },

  // @ts-ignore
  _snapLatLngToKey: function (latlng) {
    const worldCoords = latLngToWorldXY(latlng.lat, latlng.lng);
    if (!worldCoords) return null;
    return `${worldCoords.x}_${worldCoords.y}`;
  },

  // @ts-ignore
  _updateCursorStyle: function () {
    const mapContainer = this._map.getContainer();
    const isToolActive =
      this.options.activeTool && this._map.getZoom() >= GRID_ZOOM_THRESHOLD;

    if (isToolActive) {
      const hotspot = "4 28"; // Sets the cursor's active point to the bottom-left tip
      switch (this.options.activeTool) {
        case "PAINT":
          mapContainer.style.cursor = `url(${CURSOR_PAINT_URL}) ${hotspot}, auto`;
          break;
        case "ERASER":
          mapContainer.style.cursor = `url(${CURSOR_ERASER_URL}) ${hotspot}, auto`;
          break;
        case "PICKER":
          mapContainer.style.cursor = `url(${CURSOR_PICKER_URL}) ${hotspot}, auto`;
          break;
        default:
          mapContainer.style.cursor = "";
          break;
      }
    } else {
      mapContainer.style.cursor = ""; // Revert to default grab/pan cursor
    }
  },

  // @ts-ignore
  _reset: function () {
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._canvas, topLeft);

    const size = this._map.getSize();
    if (this._canvas.width !== size.x) this._canvas.width = size.x;
    if (this._canvas.height !== size.y) this._canvas.height = size.y;

    this._draw();
  },

  // @ts-ignore
  _draw: function () {
    if (!this._ctx) return;
    const ctx = this._ctx;
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    const zoom = this._map.getZoom();
    if (zoom < PIXEL_VISIBILITY_ZOOM_THRESHOLD) return;

    const mapBounds = this._map.getBounds();
    const extendedBounds = mapBounds.pad(0.2);

    const getPixelRectOnScreen = (pixelBounds, worldOffset = 0) => {
      const nw = L.latLng(
        pixelBounds.getNorth(),
        pixelBounds.getWest() + worldOffset
      );
      const se = L.latLng(
        pixelBounds.getSouth(),
        pixelBounds.getEast() + worldOffset
      );

      const nwPoint = this._map.latLngToContainerPoint(nw);
      const sePoint = this._map.latLngToContainerPoint(se);

      const x1 = Math.round(nwPoint.x);
      const y1 = Math.round(nwPoint.y);

      return {
        x: x1,
        y: y1,
        width: Math.round(sePoint.x) - x1,
        height: Math.round(sePoint.y) - y1,
      };
    };

    // --- 1. Draw painted pixels ---
    this.options.pixels.forEach((color, key) => {
      const [xStr, yStr] = key.split("_");
      const x = parseInt(xStr, 10);
      const y = parseInt(yStr, 10);

      const pixelBounds = worldXYToLatLngBounds(x, y);
      const pixelCenter = pixelBounds.getCenter();

      const worlds = [-360, 0, 360];
      worlds.forEach((worldOffset) => {
        const worldPixelCenter = L.latLng(
          pixelCenter.lat,
          pixelCenter.lng + worldOffset
        );
        if (extendedBounds.contains(worldPixelCenter)) {
          const rect = getPixelRectOnScreen(pixelBounds, worldOffset);
          if (rect.width > 0 && rect.height > 0) {
            ctx.fillStyle = color;
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
          }
        }
      });
    });

    // --- 2. Draw Grid (Optimized and Stable) ---
    const isGridDrawable = zoom >= GRID_ZOOM_THRESHOLD;
    if (isGridDrawable && this.options.isGridVisible) {
      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
      ctx.lineWidth = 1;

      const canvasSize = this._map.getSize();
      const screenNwLatLng = this._map.containerPointToLatLng(L.point(0, 0));

      const worldSizeInScreenPixels = this._map.getPixelWorldBounds().getSize();
      const pixelWidth = worldSizeInScreenPixels.x / WORLD_PIXEL_DIMENSION;
      const pixelHeight = worldSizeInScreenPixels.y / WORLD_PIXEL_DIMENSION;

      if (pixelWidth < 2 || pixelHeight < 2) return;

      const latRad = (screenNwLatLng.lat * Math.PI) / 180;
      let normLng = screenNwLatLng.lng;
      while (normLng > 180) normLng -= 360;
      while (normLng < -180) normLng += 360;
      const fractionalWorldX = ((normLng + 180) / 360) * WORLD_PIXEL_DIMENSION;
      const fractionalWorldY =
        ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) /
          2) *
        WORLD_PIXEL_DIMENSION;

      if (isNaN(fractionalWorldY)) return;

      const offsetX = fractionalWorldX - Math.floor(fractionalWorldX);
      const offsetY = fractionalWorldY - Math.floor(fractionalWorldY);
      const startX = -offsetX * pixelWidth;
      const startY = -offsetY * pixelHeight;

      ctx.beginPath();

      for (let x = startX; x < canvasSize.x; x += pixelWidth) {
        const roundedX = Math.round(x) + 0.5;
        ctx.moveTo(roundedX, 0);
        ctx.lineTo(roundedX, canvasSize.y);
      }

      for (let y = startY; y < canvasSize.y; y += pixelHeight) {
        const roundedY = Math.round(y) + 0.5;
        ctx.moveTo(0, roundedY);
        ctx.lineTo(canvasSize.x, roundedY);
      }

      ctx.stroke();
    }

    // --- 3. Draw Hover Reticle ---
    const isHoverDrawable = zoom >= GRID_ZOOM_THRESHOLD;
    if (isHoverDrawable && this.options.hoveredPixelKey) {
      const [xStr, yStr] = this.options.hoveredPixelKey.split("_");
      const x = parseInt(xStr, 10);
      const y = parseInt(yStr, 10);

      const pixelBounds = worldXYToLatLngBounds(x, y);
      const pixelCenter = pixelBounds.getCenter();

      const worlds = [-360, 0, 360];
      worlds.forEach((worldOffset) => {
        const worldPixelCenter = L.latLng(
          pixelCenter.lat,
          pixelCenter.lng + worldOffset
        );
        if (extendedBounds.contains(worldPixelCenter)) {
          const rect = getPixelRectOnScreen(pixelBounds, worldOffset);
          if (rect.width > 1 && rect.height > 1) {
            const { x: rx, y: ry, width: rw, height: rh } = rect;
            const cornerLength = Math.max(3, Math.min(rw / 3.5, rh / 3.5));
            const lineWidth = Math.max(2, Math.min(rw / 8, rh / 8));

            ctx.fillStyle = "rgba(200, 200, 200, 0.25)";
            ctx.fillRect(rx, ry, rw, rh);

            ctx.fillStyle = "rgba(20, 184, 166, 0.85)"; // Teal accent color

            // Top-left
            ctx.fillRect(rx, ry, cornerLength, lineWidth);
            ctx.fillRect(rx, ry, lineWidth, cornerLength);

            // Top-right
            ctx.fillRect(rx + rw - cornerLength, ry, cornerLength, lineWidth);
            ctx.fillRect(rx + rw - lineWidth, ry, lineWidth, cornerLength);

            // Bottom-left
            ctx.fillRect(rx, ry + rh - lineWidth, cornerLength, lineWidth);
            ctx.fillRect(rx, ry + rh - cornerLength, lineWidth, cornerLength);

            // Bottom-right
            ctx.fillRect(
              rx + rw - cornerLength,
              ry + rh - lineWidth,
              cornerLength,
              lineWidth
            );
            ctx.fillRect(
              rx + rw - lineWidth,
              ry + rh - cornerLength,
              lineWidth,
              cornerLength
            );
          }
        }
      });
    }

    // --- 4. Draw Tool Previews (Desktop only) ---
    if (
      isHoverDrawable &&
      !this.options.isTouchDevice &&
      this.options.mousePos &&
      (this.options.activeTool === "PAINT" ||
        this.options.activeTool === "PICKER")
    ) {
      const { activeTool, mousePos, selectedColor, pixels } = this.options;
      const { x: mx, y: my } = mousePos;
      const previewSize = 24;
      const previewX = mx + 16;
      const previewY = my + 16;

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;

      if (activeTool === "PAINT") {
        ctx.fillStyle = selectedColor;
        ctx.fillRect(previewX, previewY, previewSize, previewSize);
      } else if (activeTool === "PICKER") {
        const mouseLatLng = this._map.containerPointToLatLng(mousePos);
        const key = this._snapLatLngToKey(mouseLatLng);
        const hoveredColor = key ? pixels.get(key) : null;

        if (hoveredColor) {
          ctx.fillStyle = hoveredColor;
          ctx.fillRect(previewX, previewY, previewSize, previewSize);
        } else {
          // Draw checkerboard for empty pixel
          const s = 6;
          ctx.fillStyle = "#ccc";
          ctx.fillRect(previewX, previewY, previewSize, previewSize);
          ctx.fillStyle = "#fff";
          for (let i = 0; i < previewSize / s; i++) {
            for (let j = 0; j < previewSize / s; j++) {
              if ((i + j) % 2 === 0) {
                ctx.fillRect(previewX + i * s, previewY + j * s, s, s);
              }
            }
          }
        }
      }

      ctx.restore();

      // Draw border after shadow
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        previewX - 1,
        previewY - 1,
        previewSize + 2,
        previewSize + 2
      );
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 1;
      ctx.strokeRect(
        previewX - 2,
        previewY - 2,
        previewSize + 4,
        previewSize + 4
      );
    }
  },
});
