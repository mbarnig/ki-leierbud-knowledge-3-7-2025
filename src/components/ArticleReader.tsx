import { useEffect, useRef } from "react";

interface ArticleReaderProps {
  content: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  backgroundColor: string;
  textColor: string;
}

// Function to decode HTML entities
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

export function ArticleReader({ content, onSwipeLeft, onSwipeRight, backgroundColor, textColor }: ArticleReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isSwiping = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      isSwiping = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping) {
        const deltaX = Math.abs(e.touches[0].clientX - startX.current);
        const deltaY = Math.abs(e.touches[0].clientY - startY.current);
        
        // Only start swiping if horizontal movement is greater than vertical
        if (deltaX > deltaY && deltaX > 10) {
          isSwiping = true;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwiping) return;

      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - startX.current;
      const threshold = 50;

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeRight(); // Swipe right - previous article
        } else {
          onSwipeLeft(); // Swipe left - next article
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight]);

  // Enhanced content processing for better styling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Style headings with proper hierarchy and spacing
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      const tag = heading.tagName.toLowerCase();
      (heading as HTMLElement).style.color = textColor;
      (heading as HTMLElement).style.fontWeight = '600';
      (heading as HTMLElement).style.lineHeight = '1.25';
      (heading as HTMLElement).style.marginTop = '2rem';
      (heading as HTMLElement).style.marginBottom = '1rem';
      
      // Set specific sizes for each heading level
      switch (tag) {
        case 'h1':
          (heading as HTMLElement).style.fontSize = '2rem';
          break;
        case 'h2':
          (heading as HTMLElement).style.fontSize = '1.5rem';
          break;
        case 'h3':
          (heading as HTMLElement).style.fontSize = '1.25rem';
          break;
        case 'h4':
          (heading as HTMLElement).style.fontSize = '1.125rem';
          break;
        case 'h5':
          (heading as HTMLElement).style.fontSize = '1rem';
          break;
        case 'h6':
          (heading as HTMLElement).style.fontSize = '0.875rem';
          break;
      }
    });

    // Style paragraphs
    const paragraphs = container.querySelectorAll('p');
    paragraphs.forEach(p => {
      (p as HTMLElement).style.color = textColor;
      (p as HTMLElement).style.lineHeight = '1.75';
      (p as HTMLElement).style.marginBottom = '1rem';
    });

    // Make all images responsive and properly sized with gallery-appropriate margins
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      img.style.maxWidth = 'calc(100% - 2rem)';
      img.style.width = 'auto';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '1.5rem auto';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      img.style.objectFit = 'contain';
    });

    // Style videos with proper sizing and margins
    const videos = container.querySelectorAll('video');
    videos.forEach(video => {
      video.style.maxWidth = 'calc(100% - 2rem)';
      video.style.width = '100%';
      video.style.height = 'auto';
      video.style.display = 'block';
      video.style.margin = '1.5rem auto';
      video.style.borderRadius = '8px';
      video.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      video.style.objectFit = 'contain';
    });

    // Style embedded media containers (iframes, embeds) with proper aspect ratio for YouTube
    const embeds = container.querySelectorAll('iframe, embed, object');
    embeds.forEach(embed => {
      const element = embed as HTMLElement;
      
      // Check if it's a YouTube embed or similar video content
      const src = element.getAttribute('src') || '';
      const isYouTube = src.includes('youtube.com') || src.includes('youtu.be') || src.includes('youtube-nocookie.com');
      
      if (isYouTube || element.tagName.toLowerCase() === 'iframe') {
        // Set up responsive video container with 16:9 aspect ratio
        element.style.width = 'calc(100% - 2rem)';
        element.style.height = 'auto';
        element.style.aspectRatio = '16 / 9';
        element.style.maxWidth = '800px'; // Reasonable max width for videos
        element.style.minHeight = '300px'; // Minimum height for visibility
        element.style.display = 'block';
        element.style.margin = '1.5rem auto';
        element.style.borderRadius = '8px';
        element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        
        // Ensure the iframe allows fullscreen and other video features
        element.setAttribute('allowfullscreen', 'true');
        element.setAttribute('webkitallowfullscreen', 'true');
        element.setAttribute('mozallowfullscreen', 'true');
      } else {
        // Default styling for other embeds
        element.style.maxWidth = 'calc(100% - 2rem)';
        element.style.width = '100%';
        element.style.display = 'block';
        element.style.margin = '1.5rem auto';
        element.style.borderRadius = '8px';
        element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }
    });

    // Convert YouTube URLs in text to embedded players with inline playback
    const textElements = container.querySelectorAll('p, div, span');
    textElements.forEach(element => {
      if (element.children.length === 0 && element.textContent) {
        const text = element.textContent;
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/g;
        
        if (youtubeRegex.test(text)) {
          const videoId = text.match(youtubeRegex)?.[0]?.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1];
          if (videoId) {
            // Replace the text with an embedded YouTube player with inline playback parameters
            element.innerHTML = `
              <iframe 
                src="https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&playsinline=1&iv_load_policy=3&disablekb=1&controls=1&autohide=1&fs=0" 
                style="
                  width: calc(100% - 2rem);
                  aspect-ratio: 16 / 9;
                  max-width: 800px;
                  min-height: 300px;
                  display: block;
                  margin: 1.5rem auto;
                  border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                  border: none;
                "
                allowfullscreen
                webkitallowfullscreen
                mozallowfullscreen
              ></iframe>
            `;
          }
        }
      }
    });

    // Update existing YouTube iframes to use inline playback parameters
    const existingYouTubeIframes = container.querySelectorAll('iframe[src*="youtube"]');
    existingYouTubeIframes.forEach(iframe => {
      const currentSrc = iframe.getAttribute('src') || '';
      const url = new URL(currentSrc);
      
      // Add parameters for inline playback and remove large play button
      url.searchParams.set('modestbranding', '1');
      url.searchParams.set('rel', '0');
      url.searchParams.set('showinfo', '0');
      url.searchParams.set('playsinline', '1');
      url.searchParams.set('iv_load_policy', '3');
      url.searchParams.set('disablekb', '1');
      url.searchParams.set('controls', '1');
      url.searchParams.set('autohide', '1');
      url.searchParams.set('fs', '0'); // Disable fullscreen button
      
      iframe.setAttribute('src', url.toString());
    });

    // Style figure elements (often contain images/videos)
    const figures = container.querySelectorAll('figure');
    figures.forEach(figure => {
      (figure as HTMLElement).style.margin = '1.5rem auto';
      (figure as HTMLElement).style.maxWidth = 'calc(100% - 2rem)';
      (figure as HTMLElement).style.textAlign = 'center';
    });

    // Style figure captions
    const figcaptions = container.querySelectorAll('figcaption');
    figcaptions.forEach(caption => {
      (caption as HTMLElement).style.color = textColor;
      (caption as HTMLElement).style.fontSize = '0.875rem';
      (caption as HTMLElement).style.fontStyle = 'italic';
      (caption as HTMLElement).style.marginTop = '0.5rem';
      (caption as HTMLElement).style.opacity = '0.8';
    });

    // Style tables with visible borders
    const tables = container.querySelectorAll('table');
    tables.forEach(table => {
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.margin = '1rem 0';
      table.style.border = `1px solid ${textColor}40`;
      table.style.color = textColor;
    });

    // Style table cells and headers with borders
    const tableCells = container.querySelectorAll('td, th');
    tableCells.forEach(cell => {
      (cell as HTMLElement).style.border = `1px solid ${textColor}40`;
      (cell as HTMLElement).style.padding = '8px 12px';
      (cell as HTMLElement).style.color = textColor;
    });

    // Style table headers
    const tableHeaders = container.querySelectorAll('th');
    tableHeaders.forEach(header => {
      (header as HTMLElement).style.backgroundColor = `${textColor}10`;
      (header as HTMLElement).style.fontWeight = 'bold';
      (header as HTMLElement).style.textAlign = 'left';
    });

    // Style lists to show bullets/numbers
    const unorderedLists = container.querySelectorAll('ul');
    unorderedLists.forEach(ul => {
      (ul as HTMLElement).style.listStyleType = 'disc';
      (ul as HTMLElement).style.paddingLeft = '1.5rem';
      (ul as HTMLElement).style.margin = '1rem 0';
    });

    const orderedLists = container.querySelectorAll('ol');
    orderedLists.forEach(ol => {
      (ol as HTMLElement).style.listStyleType = 'decimal';
      (ol as HTMLElement).style.paddingLeft = '1.5rem';
      (ol as HTMLElement).style.margin = '1rem 0';
    });

    const listItems = container.querySelectorAll('li');
    listItems.forEach(li => {
      (li as HTMLElement).style.display = 'list-item';
      (li as HTMLElement).style.marginBottom = '0.5rem';
      (li as HTMLElement).style.color = textColor;
    });

    // Style links with blue color and no underline
    const links = container.querySelectorAll('a');
    links.forEach(link => {
      (link as HTMLElement).style.color = '#3b82f6'; // Blue color
      (link as HTMLElement).style.textDecoration = 'none';
      (link as HTMLElement).style.cursor = 'pointer';
    });

    // Style blockquotes
    const blockquotes = container.querySelectorAll('blockquote');
    blockquotes.forEach(blockquote => {
      blockquote.style.borderLeft = `4px solid ${textColor}40`;
      blockquote.style.paddingLeft = '1rem';
      blockquote.style.margin = '1rem 0';
      blockquote.style.fontStyle = 'italic';
      blockquote.style.color = textColor;
    });

    // Decode HTML entities in all text content
    const allTextNodes = container.querySelectorAll('*');
    allTextNodes.forEach(element => {
      if (element.children.length === 0 && element.textContent) {
        element.textContent = decodeHtmlEntities(element.textContent);
      }
    });
  }, [content, textColor]);

  // Decode HTML entities in the content before rendering
  const decodedContent = decodeHtmlEntities(content);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 pt-20 pb-20"
      style={{ 
        minHeight: 'calc(100vh - 8rem)',
        WebkitOverflowScrolling: 'touch',
        backgroundColor,
        color: textColor
      }}
    >
      <article 
        className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none"
        style={{ color: textColor }}
        dangerouslySetInnerHTML={{ __html: decodedContent }}
      />
    </div>
  );
}
