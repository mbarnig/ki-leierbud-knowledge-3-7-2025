
export interface Article {
  id: number;
  title: string;
  category: string;
  tag: string;
  author: string;
  content?: string;
  categoryId?: number;
}

export interface ArticleImage {
  src: string;
  tag: string;
}

export interface Classification {
  isCorrect: boolean;
  imageIndex: number;
  selectedTag: string;
  correctTag: string;
}
