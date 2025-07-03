
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

    // Make all images responsive and properly sized
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      img.style.maxWidth = '100%';
      img.style.width = 'auto';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '1rem auto';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
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
