
import { useQuery } from '@tanstack/react-query';
import { wordpressApi, WordPressArticle } from '@/services/wordpressApi';
import { Article } from '@/types';

export function useWordPressData(articleId: number, language: string = 'en') {
  // Fetch the specific article with language parameter
  const { data: wpArticle, isLoading: isLoadingArticle, error: articleError } = useQuery({
    queryKey: ['article', articleId, language],
    queryFn: () => {
      // If we have translations and the requested language has a different ID, use that
      if (wpArticle?.translations && wpArticle.translations[language] && wpArticle.translations[language] !== articleId) {
        console.log(`Using translation ID ${wpArticle.translations[language]} for language ${language}`);
        return wordpressApi.fetchArticle(wpArticle.translations[language], language);
      }
      return wordpressApi.fetchArticle(articleId, language);
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 30000,
  });

  // Get available languages from translations
  const availableLanguages = wpArticle?.translations ? 
    Object.keys(wpArticle.translations).map(langCode => ({
      code: langCode,
      name: getLanguageName(langCode),
      url: `/?p=${wpArticle.translations![langCode]}&lang=${langCode}`
    })) : 
    [
      { code: 'en', name: 'English', url: `/?p=${articleId}&lang=en` },
      { code: 'fr', name: 'Français', url: `/?p=${articleId}&lang=fr` },
      { code: 'de', name: 'Deutsch', url: `/?p=${articleId}&lang=de` },
      { code: 'lb', name: 'Lëtzebuergesch', url: `/?p=${articleId}&lang=lb` }
    ];

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
    language,
    article: !!article,
    title: article?.title,
    category: article?.category,
    categoryId: article?.categoryId,
    hasContent: !!article?.content,
    contentLength: article?.content?.length,
    availableLanguages: availableLanguages.map(l => l.code),
    translations: wpArticle?.translations,
    isLoading: isLoadingArticle,
    hasError: !!articleError
  });

  return {
    article,
    availableLanguages,
    isLoading: isLoadingArticle,
    error: articleError
  };
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
