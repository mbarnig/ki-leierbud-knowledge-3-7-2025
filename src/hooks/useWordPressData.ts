
import { useQuery } from '@tanstack/react-query';
import { wordpressApi, WordPressArticle } from '@/services/wordpressApi';
import { Article } from '@/types';

export function useWordPressData(articleId: number, language: string = 'en') {
  // Fetch the specific article with language parameter
  const { data: wpArticle, isLoading: isLoadingArticle, error: articleError } = useQuery({
    queryKey: ['article', articleId, language],
    queryFn: () => wordpressApi.fetchArticle(articleId, language),
    retry: 1,
    retryDelay: 1000,
    staleTime: 30000,
  });

  // Determine the actual language of the current article
  const actualLanguage = wpArticle?.translations 
    ? getActualLanguage(articleId, wpArticle.translations, language)
    : language;

  // Get available languages from translations
  const availableLanguages = wpArticle?.translations ? 
    Object.entries(wpArticle.translations).map(([langCode, translationId]) => ({
      code: langCode,
      name: getLanguageName(langCode),
      url: `/?p=${translationId}&lang=${langCode}`
    })) : 
    [{ code: actualLanguage, name: getLanguageName(actualLanguage), url: `/?p=${articleId}&lang=${actualLanguage}` }];

  // Get the article's category information
  const categoryTerm: any = wpArticle?._embedded?.['wp:term']?.[0]?.find((t: any) => t.taxonomy === 'category');
  const articleCategoryName = categoryTerm?.name || 'Unknown Category';
  const categoryId = categoryTerm?.id || 1;

  // Convert WordPress article to our Article type
  const article: Article | null = wpArticle ? {
    id: wpArticle.id,
    title: wpArticle.title.rendered,
    category: articleCategoryName,
    tag: wpArticle._embedded?.['wp:term']?.[1]?.find((t: any) => t.taxonomy === 'post_tag')?.name || 'article',
    author: wpArticle._embedded?.author?.[0]?.name || 'admin',
    content: wpArticle.content.rendered,
    categoryId: categoryId
  } : null;

  console.log('WordPress article data:', {
    articleId,
    requestedLanguage: language,
    actualLanguage,
    article: !!article,
    title: article?.title,
    category: article?.category,
    categoryId: article?.categoryId,
    hasContent: !!article?.content,
    contentLength: article?.content?.length,
    availableLanguages: availableLanguages.map(l => l.code),
    translations: wpArticle?.translations,
    translationIds: wpArticle?.translations ? Object.entries(wpArticle.translations) : [],
    isLoading: isLoadingArticle,
    hasError: !!articleError
  });

  return {
    article,
    availableLanguages,
    actualLanguage, // Return the actual language of the current article
    wpArticle, // Expose raw WordPress data for direct translation access
    isLoading: isLoadingArticle,
    error: articleError
  };
}

// Helper function to determine the actual language of the current article
function getActualLanguage(articleId: number, translations: { [key: string]: number }, requestedLanguage: string): string {
  // Check if the current article ID matches any translation
  for (const [langCode, translationId] of Object.entries(translations)) {
    if (translationId === articleId) {
      return langCode;
    }
  }
  // If no match found, return the requested language
  return requestedLanguage;
}

function getLanguageName(langCode: string): string {
  const names: { [key: string]: string } = {
    'en': 'English',
    'fr': 'Français', 
    'de': 'Deutsch',
    'lb': 'Lëtzebuergesch',
    'pt': 'Português'
  };
  return names[langCode] || langCode.toUpperCase();
}
