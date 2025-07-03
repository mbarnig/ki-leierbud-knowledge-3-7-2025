
import { ArrowLeft, ArrowRight, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ColorScheme {
  header: string;
  main: string;
  footer: string;
}

interface ArticleFooterProps {
  authorInitials: string;
  onPrevious: () => void;
  onNext: () => void;
  onReturnToCategory: () => void;
  onReturnToTOC: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  hasCategoryFirst: boolean;
  colorScheme: ColorScheme;
  textColor: string;
}

export function ArticleFooter({
  authorInitials,
  onPrevious,
  onNext,
  onReturnToCategory,
  onReturnToTOC,
  hasPrevious,
  hasNext,
  hasCategoryFirst,
  colorScheme,
  textColor
}: ArticleFooterProps) {
  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t z-50"
      style={{ 
        backgroundColor: `${colorScheme.footer}f0`,
        borderColor: `${textColor}20`,
        color: textColor
      }}
    >
      <div className="grid grid-cols-3 items-center px-4 py-3 h-16">
        {/* Left: Author initials and back arrow */}
        <div className="flex items-center space-x-3 justify-start">
          <span 
            className="text-xs font-bold px-2 py-1 rounded-full min-w-[32px] text-center"
            style={{ 
              backgroundColor: `${textColor}20`,
              color: textColor
            }}
          >
            {authorInitials}
          </span>
          {hasPrevious && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrevious}
              className="p-2 hover:opacity-80"
              style={{ color: textColor }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Center: Category and TOC buttons - always centered */}
        <div className="flex space-x-2 justify-center">
          {hasCategoryFirst && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReturnToCategory}
              className="px-3 border hover:opacity-80"
              style={{ 
                backgroundColor: colorScheme.footer,
                borderColor: `${textColor}40`,
                color: textColor
              }}
            >
              <Home className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Category</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onReturnToTOC}
            className="px-3 border hover:opacity-80"
            style={{ 
              backgroundColor: colorScheme.footer,
              borderColor: `${textColor}40`,
              color: textColor
            }}
          >
            <BookOpen className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">TOC</span>
          </Button>
        </div>

        {/* Right: Forward arrow */}
        <div className="flex justify-end">
          {hasNext && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              className="p-2 hover:opacity-80"
              style={{ color: textColor }}
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
