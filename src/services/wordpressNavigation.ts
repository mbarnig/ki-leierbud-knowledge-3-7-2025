export interface WordPressNavigation {
  previousArticle?: { id: number; title: string };
  nextArticle?: { id: number; title: string };
  categoryFirstArticle?: { id: number; title: string };
}

export interface ArticleLanguage {
  code: string;
  name: string;
  url: string;
}

export class WordPressNavigationService {
  async getArticleNavigation(articleId: number, categoryId: number): Promise<WordPressNavigation> {
    try {
      // Fetch all articles from the same category
      const response = await fetch(`https://admin.ki-leierbud.lu/wp-json/wp/v2/posts?categories=${categoryId}&per_page=100&orderby=date&order=asc`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch category articles');
      }
      
      const articles = await response.json();
      const currentIndex = articles.findIndex((article: any) => article.id === articleId);
      
      const navigation: WordPressNavigation = {};
      
      if (currentIndex > 0) {
        const prev = articles[currentIndex - 1];
        navigation.previousArticle = { id: prev.id, title: prev.title.rendered };
      }
      
      if (currentIndex < articles.length - 1) {
        const next = articles[currentIndex + 1];
        navigation.nextArticle = { id: next.id, title: next.title.rendered };
      }
      
      if (articles.length > 0) {
        const first = articles[0];
        navigation.categoryFirstArticle = { id: first.id, title: first.title.rendered };
      }
      
      return navigation;
    } catch (error) {
      console.warn('Navigation fetch failed, returning empty navigation');
      return {};
    }
  }

  async getArticleLanguages(articleId: number): Promise<ArticleLanguage[]> {
    try {
      // Try to fetch language alternatives for the article
      const response = await fetch(`https://admin.ki-leierbud.lu/wp-json/wp/v2/posts/${articleId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch article languages');
      }
      
      // Return default languages as fallback
      return [
        { code: 'en', name: 'English', url: `/?p=${articleId}&lang=en` },
        { code: 'fr', name: 'Français', url: `/?p=${articleId}&lang=fr` },
        { code: 'de', name: 'Deutsch', url: `/?p=${articleId}&lang=de` },
        { code: 'lb', name: 'Lëtzebuergesch', url: `/?p=${articleId}&lang=lb` }
      ];
    } catch (error) {
      console.warn('Language fetch failed, returning default languages');
      return [
        { code: 'en', name: 'English', url: `/?p=${articleId}&lang=en` }
      ];
    }
  }
}

export const wordpressNavigation = new WordPressNavigationService();
