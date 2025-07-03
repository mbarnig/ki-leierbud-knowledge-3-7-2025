import { Article } from '@/types';

export const mockArticle: Article = {
  id: 333,
  title: "Style Easy Photography Collection",
  category: "Style Easy",
  tag: "landscape",
  author: "John Smith"
};

export const mockTags = [
  "landscape",
  "wildlife",
  "nature",
  "forest",
  "mountain",
  "water",
  "sky",
  "flowers"
];

export const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "lb", name: "Lëtzebuergesch" }
];

export const translations = {
  en: {
    results: "Results",
    submit: "Submit",
    validate: "Validate",
    selectCaption: "Select caption...",
    score: "Score",
    correct: "Correct",
    incorrect: "Incorrect",
    yourChoice: "Your choice",
    correctAnswer: "Correct answer",
    returnToCategory: "Return to Category",
    tableOfContents: "Table of Contents"
  },
  fr: {
    results: "Résultats",
    submit: "Soumettre",
    validate: "Valider",
    selectCaption: "Sélectionner une légende...",
    score: "Score",
    correct: "Correct",
    incorrect: "Incorrect",
    yourChoice: "Votre choix",
    correctAnswer: "Bonne réponse",
    returnToCategory: "Retour à la catégorie",
    tableOfContents: "Table des matières"
  },
  de: {
    results: "Ergebnisse",
    submit: "Einreichen",
    validate: "Validieren",
    selectCaption: "Bildunterschrift auswählen...",
    score: "Punktzahl",
    correct: "Richtig",
    incorrect: "Falsch",
    yourChoice: "Ihre Wahl",
    correctAnswer: "Richtige Antwort",
    returnToCategory: "Zurück zur Kategorie",
    tableOfContents: "Inhaltsverzeichnis"
  },
  pt: {
    results: "Resultados",
    submit: "Enviar",
    validate: "Validar",
    selectCaption: "Selecionar legenda...",
    score: "Pontuação",
    correct: "Correto",
    incorrect: "Incorreto",
    yourChoice: "Sua escolha",
    correctAnswer: "Resposta correta",
    returnToCategory: "Voltar à categoria",
    tableOfContents: "Índice"
  },
  lb: {
    results: "Resultater",
    submit: "Schécken",
    validate: "Validéieren",
    selectCaption: "Ënnerschrëft wielen...",
    score: "Score",
    correct: "Richteg",
    incorrect: "Falsch",
    yourChoice: "Är Wiel",
    correctAnswer: "Richteg Äntwert",
    returnToCategory: "Zréck op Kategorie",
    tableOfContents: "Inhaltsverzeechnes"
  }
};
