
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages, translations } from "@/data/mockData";

interface HeaderProps {
  title: string;
  category: string;
  availableTags: string[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  isResultsPage?: boolean;
}

export function Header({
  title,
  category,
  availableTags,
  selectedTag,
  onTagSelect,
  selectedLanguage,
  onLanguageChange,
  isResultsPage = false
}: HeaderProps) {
  const titleWords = title.split(" ").slice(0, 2).join(" ");
  const t = translations[selectedLanguage as keyof typeof translations];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-4 py-3 h-16">
        {/* Left: Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-gray-900 truncate">
            {titleWords} · {category}
          </h1>
        </div>

        {/* Center: Tags dropdown or Results text */}
        <div className="flex-1 flex justify-center px-2">
          {isResultsPage ? (
            <span className="text-lg font-semibold text-gray-900">
              {t.results}
            </span>
          ) : (
            <Select value={selectedTag} onValueChange={onTagSelect}>
              <SelectTrigger className="w-full max-w-48 bg-white">
                <SelectValue placeholder={t.selectCaption} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-[100]">
                {availableTags.map((tag) => (
                  <SelectItem key={tag} value={tag} className="hover:bg-gray-50">
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Right: Language selector */}
        <div className="flex-1 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white">
                {selectedLanguage.toUpperCase()}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-[100]">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className="hover:bg-gray-50"
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
