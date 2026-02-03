// Dynamic import for marked (ES module)
let marked: any = null;

async function getMarked() {
  if (!marked) {
    const { marked: markedModule } = await import('marked');
    marked = markedModule;
    
    // Configure marked for better HTML output
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }
  return marked;
}

export async function processMarkdownToHTML(markdown: string): Promise<string> {
  try {
    // Ensure we have a valid string input
    if (!markdown || typeof markdown !== 'string') {
      console.warn('Invalid markdown input:', markdown);
      return '<p>Content not available</p>';
    }

    // Get the marked instance
    const markedInstance = await getMarked();
    
    // Convert markdown to HTML using basic marked
    const html = await markedInstance(markdown);
    
    // Add CSS classes to the HTML elements
    const styledHTML = html
      .replace(/<h1>/g, '<h1 class="prose-heading prose-h1">')
      .replace(/<h2>/g, '<h2 class="prose-heading prose-h2">')
      .replace(/<h3>/g, '<h3 class="prose-heading prose-h3">')
      .replace(/<h4>/g, '<h4 class="prose-heading prose-h4">')
      .replace(/<h5>/g, '<h5 class="prose-heading prose-h5">')
      .replace(/<h6>/g, '<h6 class="prose-heading prose-h6">')
      .replace(/<p>/g, '<p class="prose-paragraph">')
      .replace(/<ul>/g, '<ul class="prose-unordered-list">')
      .replace(/<ol>/g, '<ol class="prose-ordered-list">')
      .replace(/<li>/g, '<li class="prose-list-item">')
      .replace(/<a href="/g, '<a class="prose-link" href="')
      .replace(/<strong>/g, '<strong class="prose-strong">')
      .replace(/<em>/g, '<em class="prose-emphasis">')
      .replace(/<blockquote>/g, '<blockquote class="prose-blockquote">')
      .replace(/<hr>/g, '<hr class="prose-hr">')
      .replace(/<code>/g, '<code class="prose-inline-code">')
      .replace(/<pre>/g, '<pre class="prose-code-block">');
    
    // Basic HTML sanitization for server-side use
    const cleanHTML = styledHTML
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '');
    
    return cleanHTML;
  } catch (error) {
    console.error('Error processing markdown:', error);
    // Fallback: return the original markdown with basic HTML escaping
    return markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }
}

// Extract table of contents from markdown
export function extractTableOfContents(markdown: string): Array<{id: string, title: string, level: number}> {
  const toc: Array<{id: string, title: string, level: number}> = [];
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      const id = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      toc.push({ id, title, level });
    }
  }
  
  return toc;
}

// Calculate reading time
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Extract excerpt from markdown
export function extractExcerpt(markdown: string, maxLength: number = 160): string {
  // Remove markdown syntax
  const plainText = markdown
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}
