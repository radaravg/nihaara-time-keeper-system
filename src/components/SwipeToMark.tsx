
import { useState, useRef, useEffect } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HapticService } from '@/services/hapticService';

interface SwipeToMarkProps {
  onSwipe: () => void;
  disabled?: boolean;
  isCheckedOut?: boolean;
  onCheckOut?: () => void;
}

export const SwipeToMark = ({ onSwipe, disabled, isCheckedOut, onCheckOut }: SwipeToMarkProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    HapticService.light(); // Initial touch feedback
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    HapticService.light(); // Initial touch feedback
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const maxWidth = rect.width - 60; // Thumb width
      const newPosition = Math.max(0, Math.min(maxWidth, e.clientX - rect.left - 30));
      
      setDragPosition(newPosition);
      
      // Gentle feedback during drag
      if (Math.abs(newPosition - dragPosition) > 20) {
        HapticService.light();
      }
      
      if (newPosition >= maxWidth * 0.8) {
        HapticService.successFeedback(); // Success haptic + sound
        setIsCompleted(true);
        setIsDragging(false);
        setTimeout(() => {
          if (isCheckedOut && onCheckOut) {
            onCheckOut();
          } else {
            onSwipe();
          }
          setDragPosition(0);
          setIsCompleted(false);
        }, 300);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !sliderRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const maxWidth = rect.width - 60;
      const touch = e.touches[0];
      const newPosition = Math.max(0, Math.min(maxWidth, touch.clientX - rect.left - 30));
      
      setDragPosition(newPosition);
      
      // Gentle feedback during drag
      if (Math.abs(newPosition - dragPosition) > 20) {
        HapticService.light();
      }
      
      if (newPosition >= maxWidth * 0.8) {
        HapticService.successFeedback(); // Success haptic + sound
        setIsCompleted(true);
        setIsDragging(false);
        setTimeout(() => {
          if (isCheckedOut && onCheckOut) {
            onCheckOut();
          } else {
            onSwipe();
          }
          setDragPosition(0);
          setIsCompleted(false);
        }, 300);
      }
    };

    const handleEnd = () => {
      if (isDragging && !isCompleted) {
        HapticService.light(); // Snap back feedback
        setDragPosition(0);
      }
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, isCompleted, onSwipe, onCheckOut, isCheckedOut]);

  return (
    <div 
      ref={sliderRef}
      className={cn(
        "swipe-slider h-16 flex items-center p-2 relative cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        isCompleted && "bg-green-500/20"
      )}
    >
      <div
        ref={thumbRef}
        className={cn(
          "absolute h-12 w-12 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 z-10",
          isDragging && "scale-110 shadow-2xl shadow-primary/50",
          isCompleted && "bg-green-500"
        )}
        style={{ left: `${dragPosition + 8}px` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {isCompleted ? (
          <CheckCircle size={24} className="text-white" />
        ) : (
          <ArrowRight size={24} className="text-white" />
        )}
      </div>
      
      <div className="flex-1 text-center ml-8">
        <span className="text-muted-foreground font-medium">
          {isCheckedOut 
            ? "Swipe to Check Out" 
            : "Swipe to Mark Attendance"
          }
        </span>
      </div>
    </div>
  );
};
