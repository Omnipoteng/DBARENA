import React, { useState, useRef, useEffect } from "react";

interface ImageCropperProps {
  imageSrc: string;
  onCrop: (croppedImageBase64: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCrop, onCancel }: ImageCropperProps) {
  const [scale, setScale] = useState(1); // 1 to 5 relative to minScale
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Touch and pointer tracking
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchScaleRef = useRef<number>(1);

  // Re-calculate minScale and fit
  const getMinScale = () => {
    if (!naturalWidth || !naturalHeight || !cropWidth || !cropHeight) return 1;
    return Math.max(cropWidth / naturalWidth, cropHeight / naturalHeight);
  };

  const minScale = getMinScale();

  useEffect(() => {
    const updateSize = () => {
      if (viewportRef.current) {
        const rect = viewportRef.current.getBoundingClientRect();
        setCropWidth(rect.width);
        setCropHeight(rect.height);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalWidth(img.naturalWidth);
    setNaturalHeight(img.naturalHeight);
    setIsLoaded(true);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointersRef.current.size === 1) {
      dragStartRef.current = { x: e.clientX - x, y: e.clientY - y };
      setIsDragging(true);
    } else if (activePointersRef.current.size === 2) {
      setIsDragging(false);
      const pts = Array.from(activePointersRef.current.values());
      initialPinchDistRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      initialPinchScaleRef.current = scale;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointersRef.current.size === 2 && initialPinchDistRef.current !== null) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const factor = dist / initialPinchDistRef.current;
      const nextScale = Math.max(1, Math.min(5, initialPinchScaleRef.current * factor));

      const visualWidth = naturalWidth * minScale * nextScale;
      const visualHeight = naturalHeight * minScale * nextScale;
      const limitX = Math.max(0, (visualWidth - cropWidth) / 2);
      const limitY = Math.max(0, (visualHeight - cropHeight) / 2);

      setScale(nextScale);
      setX(prevX => Math.max(-limitX, Math.min(limitX, prevX)));
      setY(prevY => Math.max(-limitY, Math.min(limitY, prevY)));
    } else if (isDragging && activePointersRef.current.size === 1) {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;

      const visualWidth = naturalWidth * minScale * scale;
      const visualHeight = naturalHeight * minScale * scale;
      const limitX = Math.max(0, (visualWidth - cropWidth) / 2);
      const limitY = Math.max(0, (visualHeight - cropHeight) / 2);

      setX(Math.max(-limitX, Math.min(limitX, newX)));
      setY(Math.max(-limitY, Math.min(limitY, newY)));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size === 0) {
      setIsDragging(false);
    } else if (activePointersRef.current.size === 1) {
      // Resume dragging with the remaining pointer
      const remainingPointer = Array.from(activePointersRef.current.values())[0];
      dragStartRef.current = { x: remainingPointer.x - x, y: remainingPointer.y - y };
      setIsDragging(true);
      initialPinchDistRef.current = null;
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = 0.02;
    const nextScale = Math.max(1, Math.min(5, scale - e.deltaY * zoomFactor));

    const visualWidth = naturalWidth * minScale * nextScale;
    const visualHeight = naturalHeight * minScale * nextScale;
    const limitX = Math.max(0, (visualWidth - cropWidth) / 2);
    const limitY = Math.max(0, (visualHeight - cropHeight) / 2);

    setScale(nextScale);
    setX(prevX => Math.max(-limitX, Math.min(limitX, prevX)));
    setY(prevY => Math.max(-limitY, Math.min(limitY, prevY)));
  };

  const handleSave = async () => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = 1200; // Output width
    canvas.height = 300; // Output height (4:1 ratio)
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Scale parameter (relative scale * minScale)
    const s = scale * minScale;

    // Viewport width and height in original source image space
    const cropWNatural = cropWidth / s;
    const cropHNatural = cropHeight / s;

    // Translate translation coordinates from UI space to original image space
    const sourceX = (img.naturalWidth / 2) - (cropWNatural / 2) - (x / s);
    const sourceY = (img.naturalHeight / 2) - (cropHNatural / 2) - (y / s);

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      cropWNatural,
      cropHNatural,
      0,
      0,
      1200,
      300
    );

    const croppedBase64 = canvas.toDataURL("image/jpeg", 0.9);
    onCrop(croppedBase64);
  };

  // Compute CSS values for image container
  const imgStyle: React.CSSProperties = {
    width: naturalWidth * minScale * scale,
    height: naturalHeight * minScale * scale,
    transform: `translate(${x}px, ${y}px)`,
    maxWidth: "none",
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 p-4 select-none backdrop-blur-md"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">Adjust banner</span>
            <h4 className="mt-1 font-display text-xl uppercase tracking-[0.05em] text-white sm:text-2xl">
              Sesuaikan Area Banner
            </h4>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/15"
          >
            Batal
          </button>
        </div>

        {/* Viewport container */}
        <div className="mt-6 flex flex-col items-center">
          <div
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            className="relative w-full aspect-[4/1] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 cursor-move touch-none"
          >
            {/* Draggable Image */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop target"
              onLoad={handleImageLoad}
              style={imgStyle}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none select-none"
            />

            {/* Grid Overlay lines (fade in on drag) */}
            <div className={`absolute inset-0 pointer-events-none border-2 border-white/40 transition-opacity duration-300 ${isDragging ? "opacity-100" : "opacity-30"}`}>
              {/* Vertical line 1 */}
              <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-white/20" />
              {/* Vertical line 2 */}
              <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-white/20" />
              {/* Horizontal line 1 */}
              <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/20" />
              {/* Horizontal line 2 */}
              <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-white/20" />
            </div>

            {/* Banner shape outline */}
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/15 rounded-2xl" />
          </div>

          <p className="mt-3 text-[10px] text-center uppercase tracking-[0.25em] text-white/40">
            Geser gambar untuk memposisikan • Gunakan scroll/pinch untuk zoom
          </p>

          {/* Zoom controls */}
          <div className="mt-6 flex w-full items-center gap-4 px-2">
            <span className="text-xs font-bold text-white/50">-</span>
            <input
              type="range"
              min={1}
              max={5}
              step={0.01}
              value={scale}
              onChange={(e) => {
                const nextScale = Number(e.target.value);
                const visualWidth = naturalWidth * minScale * nextScale;
                const visualHeight = naturalHeight * minScale * nextScale;
                const limitX = Math.max(0, (visualWidth - cropWidth) / 2);
                const limitY = Math.max(0, (visualHeight - cropHeight) / 2);

                setScale(nextScale);
                setX(prevX => Math.max(-limitX, Math.min(limitX, prevX)));
                setY(prevY => Math.max(-limitY, Math.min(limitY, prevY)));
              }}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-white/10 accent-white outline-none"
              style={{
                background: `linear-gradient(to right, #ffffff 0%, #ffffff ${((scale - 1) / 4) * 100}%, rgba(255,255,255,0.1) ${((scale - 1) / 4) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
              aria-label="Zoom slider"
            />
            <span className="text-xs font-bold text-white/50">+</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-transparent px-6 text-sm font-semibold text-white/70 transition hover:bg-white/5"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!isLoaded}
            onClick={handleSave}
            className="flex h-11 items-center justify-center rounded-2xl bg-white px-6 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-50"
          >
            Simpan Crop
          </button>
        </div>

      </div>
    </div>
  );
}
