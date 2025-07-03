
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ArticleLanguage {
  code: string;
  name: string;
  url: string;
}

interface ColorScheme {
  header: string;
  main: string;
  footer: string;
}

interface ArticleHeaderProps {
  title: string;
  availableLanguages: ArticleLanguage[];
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  colorScheme: ColorScheme;
  textColor: string;
}

export function ArticleHeader({
  title,
  availableLanguages,
  selectedLanguage,
  onLanguageChange,
  colorScheme,
  textColor
}: ArticleHeaderProps) {
  const truncatedTitle = title.length > 60 ? title.substring(0, 60) + "..." : title;

  return (
    <header 
      className="fixed top-0 left-0 right-0 backdrop-blur-sm border-b z-50"
      style={{ 
        backgroundColor: `${colorScheme.header}f0`,
        borderColor: `${textColor}20`,
        color: textColor
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 h-16">
        {/* Left: Article Title */}
        <div className="flex-1 min-w-0 pr-4">
          <h1 className="text-sm font-semibold truncate" style={{ color: textColor }}>
            {truncatedTitle}
          </h1>
        </div>

        {/* Right: Language Selector */}
        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="min-w-[80px] border"
                style={{ 
                  backgroundColor: colorScheme.header,
                  borderColor: `${textColor}40`,
                  color: textColor
                }}
              >
                {selectedLanguage.toUpperCase()}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="border shadow-lg z-[100]"
              style={{ 
                backgroundColor: colorScheme.header,
                borderColor: `${textColor}40`
              }}
            >
              {availableLanguages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className="hover:opacity-80"
                  style={{ color: textColor }}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
