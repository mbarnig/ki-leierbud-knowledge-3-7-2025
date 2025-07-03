
import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Classification, Article } from "@/types";

interface ResultsDisplayProps {
  classifications: Classification[];
  selectedLanguage: string;
  article: Article;
}

// Basic translations for the results page
const translations = {
  en: {
    correct: "correct",
    incorrect: "incorrect",
    yourChoice: "Your choice",
    correctAnswer: "Correct answer",
    results: "Results"
  },
  fr: {
    correct: "correct",
    incorrect: "incorrect", 
    yourChoice: "Votre choix",
    correctAnswer: "Bonne réponse",
    results: "Résultats"
  },
  de: {
    correct: "richtig",
    incorrect: "falsch",
    yourChoice: "Ihre Wahl", 
    correctAnswer: "Richtige Antwort",
    results: "Ergebnisse"
  },
  lb: {
    correct: "richteg",
    incorrect: "falsch",
    yourChoice: "Är Wahl",
    correctAnswer: "Richteg Äntwert", 
    results: "Resultater"
  }
};

export function ResultsDisplay({ classifications, selectedLanguage, article }: ResultsDisplayProps) {
  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;
  
  const correctCount = classifications.filter(c => c.isCorrect).length;
  const totalCount = classifications.length;
  const percentage = Math.round((correctCount / totalCount) * 100);

  const getResultsMessage = (score: number): string => {
    if (score >= 95) return "Excellent! You have a great eye for detail.";
    if (score >= 75) return "Very good! You understand most concepts well.";
    if (score >= 50) return "Good job! There's room for improvement.";
    if (score >= 25) return "Keep practicing! You're making progress.";
    if (score >= 5) return "Don't give up! Everyone starts somewhere.";
    return "Take your time and try again. Practice makes perfect!";
  };

  // Function to extract text content from HTML
  const extractTextFromHtml = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || doc.body.innerText || '';
  };

  console.log('ResultsDisplay classifications:', classifications);

  return (
    <div className="pt-16 pb-16 px-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Introduction Text from Article */}
        {article.content && (
          <Card className="p-6 bg-white shadow-lg">
            <div className="prose prose-gray max-w-none">
              <div className="text-gray-700 leading-relaxed">
                {extractTextFromHtml(article.content)}
              </div>
            </div>
          </Card>
        )}

        {/* Score Card */}
        <Card className="p-6 bg-white shadow-lg">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {percentage}%
            </div>
            <div className="text-lg text-gray-600 mb-4">
              {correctCount} / {totalCount} {t.correct}
            </div>
            <div className="text-gray-700">
              {getResultsMessage(percentage)}
            </div>
          </div>
        </Card>

        {/* Individual Results */}
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Detailed Results
          </h3>
          <div className="space-y-3">
            {classifications.map((classification, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  classification.isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold">
                    {String(classification.imageIndex + 1).padStart(2, '0')}
                  </div>
                  <div className="flex items-center space-x-2">
                    {classification.isCorrect ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium">
                      {classification.isCorrect ? t.correct : t.incorrect}
                    </span>
                  </div>
                </div>
                
                <div className="text-right text-sm">
                  {!classification.isCorrect && (
                    <div className="text-red-600 mb-1">
                      <span className="font-medium">{t.yourChoice}:</span> {classification.selectedTag}
                    </div>
                  )}
                  <div className="text-green-600">
                    <span className="font-medium">{t.correctAnswer}:</span> {classification.correctTag}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
