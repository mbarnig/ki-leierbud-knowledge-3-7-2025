
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ColorScheme {
  header: string;
  main: string;
  footer: string;
}

const DEFAULT_COLOR_SCHEME: ColorScheme = {
  header: '#ffffff',
  main: '#f9fafb',
  footer: '#ffffff'
};

// Function to calculate luminance and determine if text should be black or white
const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance using the standard formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export const useColorScheme = () => {
  const [searchParams] = useSearchParams();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(DEFAULT_COLOR_SCHEME);
  const [textColors, setTextColors] = useState({
    header: '#000000',
    main: '#000000',
    footer: '#000000'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const colorName = searchParams.get('color');
    
    if (!colorName) {
      // Use default colors
      setColorScheme(DEFAULT_COLOR_SCHEME);
      setTextColors({
        header: getContrastColor(DEFAULT_COLOR_SCHEME.header),
        main: getContrastColor(DEFAULT_COLOR_SCHEME.main),
        footer: getContrastColor(DEFAULT_COLOR_SCHEME.footer)
      });
      return;
    }

    const fetchColorScheme = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching color scheme: ${colorName}`);
        
        // Try direct request first
        let response;
        try {
          response = await fetch(`https://admin.ki-leierbud.lu/my-json/${colorName}.json`);
        } catch (corsError) {
          console.log('Direct request failed due to CORS, trying proxy...');
          // Use CORS proxy as fallback
          response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://admin.ki-leierbud.lu/my-json/${colorName}.json`)}`);
          
          if (response.ok) {
            const proxyData = await response.json();
            const colors: ColorScheme = JSON.parse(proxyData.contents);
            
            console.log('Color scheme loaded via proxy:', colors);
            
            // Validate that all required colors are present
            if (!colors.header || !colors.main || !colors.footer) {
              throw new Error('Invalid color scheme format');
            }
            
            setColorScheme(colors);
            
            // Calculate contrast colors for text
            setTextColors({
              header: getContrastColor(colors.header),
              main: getContrastColor(colors.main),
              footer: getContrastColor(colors.footer)
            });
            
            setIsLoading(false);
            return;
          }
        }
        
        if (!response.ok) {
          throw new Error(`Failed to load color scheme: ${colorName} (${response.status})`);
        }
        
        const colors: ColorScheme = await response.json();
        console.log('Color scheme loaded:', colors);
        
        // Validate that all required colors are present
        if (!colors.header || !colors.main || !colors.footer) {
          throw new Error('Invalid color scheme format');
        }
        
        setColorScheme(colors);
        
        // Calculate contrast colors for text
        setTextColors({
          header: getContrastColor(colors.header),
          main: getContrastColor(colors.main),
          footer: getContrastColor(colors.footer)
        });
        
      } catch (err) {
        console.warn('Failed to load color scheme, using defaults:', err);
        setError(err instanceof Error ? err.message : 'CORS error - server needs to allow cross-origin requests');
        setColorScheme(DEFAULT_COLOR_SCHEME);
        setTextColors({
          header: getContrastColor(DEFAULT_COLOR_SCHEME.header),
          main: getContrastColor(DEFAULT_COLOR_SCHEME.main),
          footer: getContrastColor(DEFAULT_COLOR_SCHEME.footer)
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchColorScheme();
  }, [searchParams]);

  return {
    colorScheme,
    textColors,
    isLoading,
    error
  };
};
