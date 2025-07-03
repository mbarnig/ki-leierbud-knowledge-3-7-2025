export interface WordPressArticle {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  categories: number[];
  tags: number[];
  author: number;
  translations?: { [key: string]: number };
  _embedded?: {
    author: Array<{ name: string }>;
    'wp:term': Array<Array<{ id: number; name: string; taxonomy: string }>>;
  };
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
}

const BASE_URL = 'https://admin.ki-leierbud.lu/wp-json/wp/v2';

export class WordPressApiService {
  async makeRequest<T>(url: string): Promise<T> {
    try {
      console.log(`Attempting to fetch: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched data from: ${url}`, data);
      return data;
    } catch (error) {
      console.error(`Failed to fetch from WordPress API (${url}):`, error);
      throw new Error(`WordPress API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async fetchArticle(articleId: number, language: string = 'en'): Promise<WordPressArticle> {
    try {
      console.log(`Fetching article ${articleId} in language ${language}`);
      const article = await this.makeRequest<WordPressArticle>(`${BASE_URL}/posts/${articleId}?lang=${language}&_embed`);
      console.log('Article translations available:', article.translations);
      return article;
    } catch (error) {
      console.warn('WordPress API not accessible, using fallback data for article');
      
      // Return language-specific content
      const contentByLang = {
        en: `
          <h2>Sample Article Content ${articleId}</h2>
          <p>This is a sample article with ID ${articleId}. The WordPress server is not accessible, so this mock content is being displayed.</p>
          <p>This article reader supports:</p>
          <ul>
            <li>Horizontal swiping between articles</li>
            <li>Mobile-first responsive design</li>
            <li>Language selection</li>
            <li>Article navigation within categories</li>
          </ul>
          <p>You can swipe left and right to navigate between articles in the same category.</p>
          <p>The app will automatically fetch real content when the WordPress API is available.</p>
        `,
        fr: `
          <h2>Contenu d'article exemple ${articleId}</h2>
          <p>Ceci est un article d'exemple avec l'ID ${articleId}. Le serveur WordPress n'est pas accessible, donc ce contenu simulé est affiché.</p>
          <p>Ce lecteur d'article supporte :</p>
          <ul>
            <li>Balayage horizontal entre les articles</li>
            <li>Design responsive mobile-first</li>
            <li>Sélection de langue</li>
            <li>Navigation d'articles dans les catégories</li>
          </ul>
          <p>Vous pouvez balayer à gauche et à droite pour naviguer entre les articles de la même catégorie.</p>
          <p>L'application récupérera automatiquement le vrai contenu quand l'API WordPress sera disponible.</p>
        `,
        de: `
          <h2>Beispiel-Artikel-Inhalt ${articleId}</h2>
          <p>Dies ist ein Beispielartikel mit der ID ${articleId}. Der WordPress-Server ist nicht erreichbar, daher wird dieser simulierte Inhalt angezeigt.</p>
          <p>Dieser Artikelleser unterstützt:</p>
          <ul>
            <li>Horizontales Wischen zwischen Artikeln</li>
            <li>Mobile-first responsive Design</li>
            <li>Sprachauswahl</li>
            <li>Artikelnavigation innerhalb von Kategorien</li>
          </ul>
          <p>Sie können nach links und rechts wischen, um zwischen Artikeln derselben Kategorie zu navigieren.</p>
          <p>Die App wird automatisch echten Inhalt abrufen, wenn die WordPress-API verfügbar ist.</p>
        `
      };

      return {
        id: articleId,
        title: { rendered: `Sample Article ${articleId}` },
        content: { 
          rendered: contentByLang[language as keyof typeof contentByLang] || contentByLang.en
        },
        categories: [1],
        tags: [1],
        author: 1,
        _embedded: {
          author: [{ name: "Sample Author" }],
          'wp:term': [
            [{ id: 1, name: "Sample Category", taxonomy: "category" }],
            [{ id: 1, name: "sample", taxonomy: "post_tag" }]
          ]
        }
      };
    }
  }

  async fetchPostsByCategory(categoryId: number): Promise<WordPressArticle[]> {
    try {
      const posts = await this.makeRequest<WordPressArticle[]>(`${BASE_URL}/posts?categories=${categoryId}&lang=en&_embed&per_page=100`);
      console.log(`Fetched ${posts.length} posts from category ${categoryId}:`, posts.map(p => ({ id: p.id, title: p.title.rendered })));
      return posts;
    } catch (error) {
      console.warn('WordPress API not accessible, using fallback data for category posts');
      return [
        {
          id: 401,
          title: { rendered: "Sample Post 1" },
          content: { rendered: "<p>Sample content 1</p>" },
          categories: [1],
          tags: [1],
          author: 1,
          _embedded: {
            author: [{ name: "Sample Author" }],
            'wp:term': [
              [{ id: 1, name: "Sample Category", taxonomy: "category" }],
              [{ id: 1, name: "sample", taxonomy: "post_tag" }]
            ]
          }
        },
        {
          id: 402,
          title: { rendered: "Sample Post 2" },
          content: { rendered: "<p>Sample content 2</p>" },
          categories: [1],
          tags: [2],
          author: 1,
          _embedded: {
            author: [{ name: "Sample Author" }],
            'wp:term': [
              [{ id: 1, name: "Sample Category", taxonomy: "category" }],
              [{ id: 2, name: "sample2", taxonomy: "post_tag" }]
            ]
          }
        }
      ];
    }
  }

  async fetchCategories(): Promise<WordPressCategory[]> {
    try {
      return await this.makeRequest<WordPressCategory[]>(`${BASE_URL}/categories?lang=en`);
    } catch (error) {
      console.warn('WordPress API not accessible, using fallback data for categories');
      return [{ id: 1, name: "Sample Category", slug: "sample-category" }];
    }
  }

  async fetchTags(): Promise<WordPressTag[]> {
    try {
      const tags = await this.makeRequest<WordPressTag[]>(`${BASE_URL}/tags?lang=en&per_page=100`);
      console.log(`Fetched ${tags.length} tags:`, tags.map(t => t.name));
      return tags;
    } catch (error) {
      console.warn('WordPress API not accessible, using fallback data for tags');
      return [
        { id: 1, name: "sample", slug: "sample" },
        { id: 2, name: "sample2", slug: "sample2" }
      ];
    }
  }
}

export const wordpressApi = new WordPressApiService();
