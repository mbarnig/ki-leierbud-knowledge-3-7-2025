import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ArticleHeader } from "@/components/ArticleHeader";
import { ArticleFooter } from "@/components/ArticleFooter";
import { ArticleReader } from "@/components/ArticleReader";
import { useWordPressData } from "@/hooks/useWordPressData";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useIsMobile } from "@/hooks/use-mobile";
import { wordpressNavigation, WordPressNavigation } from "@/services/wordpressNavigation";
import { useToast } from "@/hooks/use-toast";

// Function to decode HTML entities
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

const Index = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  // Get article ID from URL params, default to 12 for testing
  const articleId = parseInt(searchParams.get('p') || '12');
  const selectedLanguage = searchParams.get('lang') || 'en';
  
  console.log('Index component loaded with:', { articleId, selectedLanguage });
  
  const [navigation, setNavigation] = useState<WordPressNavigation>({});

  // Get color scheme
  const { colorScheme, textColors, isLoading: colorLoading, error: colorError } = useColorScheme();

  // Get main article data with language support - now includes wpArticle and actualLanguage
  const { article, availableLanguages, actualLanguage, wpArticle, isLoading, error } = useWordPressData(articleId, selectedLanguage);

  // Get next article data for dual-pane display (only for desktop and valid next article ID)
  const nextArticleId = navigation.nextArticle?.id;
  const shouldFetchNextArticle = Boolean(!isMobile && nextArticleId && nextArticleId > 0);
  
  console.log('Next article fetch decision:', {
    isMobile,
    nextArticleId,
    shouldFetchNextArticle,
    actualLanguage
  });
  
  const { article: nextArticle, isLoading: isLoadingNext } = useWordPressData(
    shouldFetchNextArticle ? nextArticleId : 0, // Use 0 to disable the query when not needed
    actualLanguage // Use the actual language instead of selected language
  );

  // Memoize the navigation fetch to prevent infinite loops
  const categoryId = useMemo(() => article?.categoryId, [article?.categoryId]);

  // Fetch navigation when article changes (but only when categoryId changes)
  useEffect(() => {
    if (articleId && categoryId) {
      console.log('Fetching navigation for article', articleId, 'in category', categoryId);
      
      let isCancelled = false;
      
      wordpressNavigation.getArticleNavigation(articleId, categoryId)
        .then((nav) => {
          if (!isCancelled) {
            console.log('Navigation fetched:', nav);
            setNavigation(nav);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            console.error('Navigation fetch error:', err);
          }
        });
      
      return () => {
        isCancelled = true;
      };
    }
  }, [articleId, categoryId]);

  const navigateToArticle = (newArticleId: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('p', newArticleId.toString());
    setSearchParams(newParams);
  };

  const handleLanguageChange = (language: string) => {
    console.log('=== LANGUAGE CHANGE DEBUG ===');
    console.log('Requested language:', language);
    console.log('Current actual language:', actualLanguage);
    console.log('Current article ID:', articleId);
    console.log('Available translations:', wpArticle?.translations);
    
    // If requesting the same language as current, show message
    if (language === actualLanguage) {
      console.log('Already in requested language, showing toast');
      toast({
        title: "Already in this language",
        description: `Article is already displayed in ${getLanguageDisplayName(language)}`,
      });
      return;
    }
    
    // Use direct translation ID access
    if (wpArticle?.translations && wpArticle.translations[language]) {
      const targetArticleId = wpArticle.translations[language];
      console.log(`Found translation: ${language} -> article ID ${targetArticleId}`);
      
      const newParams = new URLSearchParams();
      newParams.set('p', targetArticleId.toString());
      newParams.set('lang', language);
      
      // Preserve color parameter if present
      const colorParam = searchParams.get('color');
      if (colorParam) {
        newParams.set('color', colorParam);
      }
      
      console.log('Navigating to:', newParams.toString());
      setSearchParams(newParams);
      
      toast({
        title: "Language Changed",
        description: `Switched to ${getLanguageDisplayName(language)}`,
      });
    } else {
      console.warn(`No translation available for language: ${language}`);
      console.log('Available translations:', Object.keys(wpArticle?.translations || {}));
      toast({
        title: "Translation Not Available",
        description: `Translation for ${getLanguageDisplayName(language)} is not available for this article`,
        variant: "destructive"
      });
    }
  };

  const getLanguageDisplayName = (langCode: string): string => {
    const targetLanguage = availableLanguages.find(lang => lang.code === langCode);
    return targetLanguage?.name || langCode.toUpperCase();
  };

  const handlePrevious = () => {
    console.log('Previous clicked, navigation:', navigation);
    if (navigation.previousArticle) {
      console.log('Navigating to previous article:', navigation.previousArticle.id);
      navigateToArticle(navigation.previousArticle.id);
    } else {
      console.log('No previous article available');
    }
  };

  const handleNext = () => {
    console.log('Next clicked, navigation:', navigation);
    if (navigation.nextArticle) {
      console.log('Navigating to next article:', navigation.nextArticle.id);
      navigateToArticle(navigation.nextArticle.id);
    } else {
      console.log('No next article available');
    }
  };

  const handleReturnToCategory = () => {
    if (navigation.categoryFirstArticle) {
      navigateToArticle(navigation.categoryFirstArticle.id);
    }
  };

  const handleReturnToTOC = () => {
    window.open("https://ki-leierbud.lu/toc.html", "_blank");
  };

  const handleSwipeLeft = () => {
    handleNext();
  };

  const handleSwipeRight = () => {
    handlePrevious();
  };

  // For desktop dual-pane, navigate to next article when swiping left on the second pane
  const handleNextArticleSwipeLeft = () => {
    if (nextArticle && navigation.nextArticle) {
      // Find the article after the next article
      wordpressNavigation.getArticleNavigation(nextArticle.id, nextArticle.categoryId)
        .then((nextNav) => {
          if (nextNav.nextArticle) {
            navigateToArticle(nextNav.nextArticle.id);
          }
        })
        .catch((err) => {
          console.error('Error getting next navigation:', err);
        });
    }
  };

  // For desktop dual-pane, navigate to the next article when swiping right on the second pane
  const handleNextArticleSwipeRight = () => {
    navigateToArticle(nextArticle?.id || articleId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colorScheme.main }}>
        <div className="text-center">
          <div className="text-lg font-semibold" style={{ color: textColors.main }}>Loading article...</div>
          <div className="text-sm mt-2" style={{ color: textColors.main, opacity: 0.7 }}>Fetching article {articleId} in {selectedLanguage}</div>
          {error && (
            <div className="text-xs mt-2" style={{ color: textColors.main, opacity: 0.8 }}>
              WordPress server not accessible, loading demo content...
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colorScheme.main }}>
        <div className="text-center">
          <div className="text-lg font-semibold" style={{ color: textColors.main }}>Unable to load article</div>
          <div className="mt-2" style={{ color: textColors.main, opacity: 0.8 }}>Article {articleId} could not be loaded</div>
          <div className="text-sm mt-2" style={{ color: textColors.main, opacity: 0.7 }}>
            The WordPress server at ki-leierbud.lu may be temporarily unavailable.
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 rounded hover:opacity-80 transition-opacity"
            style={{ backgroundColor: colorScheme.header, color: textColors.header }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const authorInitials = article.author
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  // Decode HTML entities in the title
  const decodedTitle = decodeHtmlEntities(article.title);
  const decodedNextTitle = nextArticle ? decodeHtmlEntities(nextArticle.title) : '';

  // Show dual-pane layout for desktop when we have a next article
  const showDualPane = !isMobile && nextArticle && !isLoadingNext;

  console.log('Dual pane decision:', {
    isMobile,
    hasNextArticle: !!nextArticle,
    isLoadingNext,
    showDualPane
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colorScheme.main }}>
      {/* Display connection status */}
      {error && (
        <div className="border-l-4 p-2 text-sm" style={{ 
          backgroundColor: `${colorScheme.main}dd`, 
          borderColor: colorScheme.header,
          color: textColors.main 
        }}>
          <span className="font-medium">Demo Mode:</span> WordPress server not accessible, using sample content
        </div>
      )}
      
      {/* Display color loading error if any */}
      {colorError && (
        <div className="border-l-4 p-2 text-sm" style={{ 
          backgroundColor: `${colorScheme.main}dd`, 
          borderColor: colorScheme.footer,
          color: textColors.main 
        }}>
          <span className="font-medium">Color Scheme:</span> {colorError}, using defaults
        </div>
      )}
      
      <ArticleHeader
        title={showDualPane ? `${decodedTitle} | ${decodedNextTitle}` : decodedTitle}
        availableLanguages={availableLanguages}
        selectedLanguage={actualLanguage} // Use actual language instead of selected
        onLanguageChange={handleLanguageChange}
        colorScheme={colorScheme}
        textColor={textColors.header}
      />

      {showDualPane ? (
        // Dual-pane layout for desktop
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 border-r" style={{ borderColor: `${textColors.main}20` }}>
            <ArticleReader
              content={article.content || '<p>No content available</p>'}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              backgroundColor={colorScheme.main}
              textColor={textColors.main}
            />
          </div>
          <div className="flex-1">
            <ArticleReader
              content={nextArticle.content || '<p>No content available</p>'}
              onSwipeLeft={handleNextArticleSwipeLeft}
              onSwipeRight={handleNextArticleSwipeRight}
              backgroundColor={colorScheme.main}
              textColor={textColors.main}
            />
          </div>
        </div>
      ) : (
        // Single-pane layout for mobile or when no next article
        <ArticleReader
          content={article.content || '<p>No content available</p>'}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          backgroundColor={colorScheme.main}
          textColor={textColors.main}
        />
      )}

      <ArticleFooter
        authorInitials={authorInitials}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onReturnToCategory={handleReturnToCategory}
        onReturnToTOC={handleReturnToTOC}
        hasPrevious={!!navigation.previousArticle}
        hasNext={!!navigation.nextArticle}
        hasCategoryFirst={!!navigation.categoryFirstArticle}
        colorScheme={colorScheme}
        textColor={textColors.footer}
      />
    </div>
  );
};

export default Index;
