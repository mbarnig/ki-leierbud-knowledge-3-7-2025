
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translations } from "@/data/mockData";

interface FooterProps {
  authorInitials: string;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  onReturnToCategory: () => void;
  onReturnToTOC?: () => void;
  selectedLanguage: string;
  isResultsPage?: boolean;
  canSubmit?: boolean;
}

export function Footer({
  authorInitials,
  onPrevious,
  onNext,
  onSubmit,
  onReturnToCategory,
  onReturnToTOC,
  selectedLanguage,
  isResultsPage = false,
  canSubmit = false
}: FooterProps) {
  const t = translations[selectedLanguage as keyof typeof translations];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 h-16">
        {/* Left: Author initials and back arrow */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            {authorInitials}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Center: Action buttons */}
        <div className="flex space-x-2">
          {isResultsPage ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onReturnToCategory}
                className="bg-white"
              >
                {t.returnToCategory}
              </Button>
              {onReturnToTOC && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReturnToTOC}
                  className="bg-white"
                >
                  {t.tableOfContents}
                </Button>
              )}
            </>
          ) : (
            <>
              {onSubmit && (
                <Button
                  onClick={onSubmit}
                  disabled={!canSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  {t.submit}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onReturnToCategory}
                className="bg-white"
              >
                {t.returnToCategory}
              </Button>
            </>
          )}
        </div>

        {/* Right: Forward arrow */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          className="p-2"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </footer>
  );
}
