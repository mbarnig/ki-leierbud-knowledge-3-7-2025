import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface ImageGalleryProps {
  images: Array<{ src: string; tag: string }>;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  selectedCaption?: string;
}

export function ImageGallery({
  images,
  currentIndex,
  onIndexChange,
  selectedCaption
}: ImageGalleryProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        onIndexChange(currentIndex - 1);
      } else if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
        onIndexChange(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, onIndexChange]);

  if (!images.length) {
    return (
      <div className="pt-16 pb-16 px-4 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">No images available</div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="pt-16 pb-16 px-4 min-h-screen flex items-center justify-center bg-gray-50">
      <Card 
        className="relative w-full max-w-4xl mx-auto bg-white shadow-lg overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative">
          {/* Image number overlay */}
          <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {String(currentIndex + 1).padStart(2, '0')}
          </div>

          {/* Image container with full flexibility */}
          <div className="flex justify-center items-center bg-gray-100" style={{ height: 'calc(100vh - 280px)' }}>
            <img
              src={currentImage.src}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain transition-opacity duration-300"
              loading="lazy"
              onError={(e) => {
                console.error('Failed to load image:', currentImage.src);
                // Keep the broken image visible so user knows there's an issue
              }}
            />
          </div>

          {/* Caption overlay */}
          {selectedCaption && (
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-center">
                <span className="text-sm font-medium">{selectedCaption}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center items-center py-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-blue-600"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
