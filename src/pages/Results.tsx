
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { useWordPressData } from "@/hooks/useWordPressData";
import { Classification } from "@/types";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Get article ID from URL params or location state
  const urlParams = new URLSearchParams(location.search);
  const originalArticleId = parseInt(urlParams.get('articleId') || '333');
  
  const classifications = (location.state?.classifications || []) as Classification[];
  
  // Calculate percentage to determine which result article to fetch
  const correctCount = classifications.filter(c => c.isCorrect).length;
  const totalCount = classifications.length;
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  // Determine result article ID based on percentage - corrected mapping
  const getResultArticleId = (score: number): number => {
    if (score > 95) return 358;   // >95%
    if (score >= 75) return 360;  // 75–95%
    if (score >= 50) return 362;  // 50–75%
    if (score >= 25) return 365;  // 25–50%
    if (score >= 5) return 370;   // 5–25%
    return 367; // ≤5%
  };

  const resultArticleId = getResultArticleId(percentage);
  
  // Fetch WordPress data for the result article
  const { article, isLoading, error } = useWordPressData(resultArticleId);

  const handleReturnToCategory = () => {
    navigate(`/?articleId=${originalArticleId}`);
  };

  const handleReturnToTOC = () => {
    window.open("https://ki-leierbud.lu/?p=244", "_blank");
  };

  const handlePrevious = () => {
    navigate(`/?articleId=${originalArticleId}`);
  };

  const handleNext = () => {
    navigate(`/?articleId=${originalArticleId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading results...</div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600">Error loading article data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={article.title}
        category={article.category}
        availableTags={[]}
        selectedTag=""
        onTagSelect={() => {}}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        isResultsPage={true}
      />

      <ResultsDisplay
        classifications={classifications}
        selectedLanguage={selectedLanguage}
        article={article}
      />

      <Footer
        authorInitials={article.author.split(" ").map(n => n[0]).join("")}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onReturnToCategory={handleReturnToCategory}
        onReturnToTOC={handleReturnToTOC}
        selectedLanguage={selectedLanguage}
        isResultsPage={true}
      />
    </div>
  );
};

export default Results;
