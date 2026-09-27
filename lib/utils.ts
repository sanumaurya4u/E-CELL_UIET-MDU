import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatDate(iso?: string | null): string {
  if (!iso) return '';
  const dateStr = iso.includes('T') ? iso : `${iso}T00:00:00`;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function avatarUrl(name?: string | null): string {
  const initials = (name || 'EC')
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="60" fill="#6C63FF"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="40" font-weight="bold">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function estimateReadingTime(content: string): number {
  const words = (content || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function sanitizeUrl(url: string): string {
  const trimmed = (url || '').trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return '#';
  }
  return trimmed;
}

export function renderMarkdown(md: string): string {
  if (!md) return '';
  // Normalize line endings and escape raw HTML
  let html = md
    .replace(/\r\n/g, '\n')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Horizontal rule
  html = html.replace(/^---+\s*$/gm, '<hr />');

  // Headings (must be at line start)
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Blockquotes
  html = html.replace(/^&gt;\s?(.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/(<blockquote>.*<\/blockquote>\n?)+/g, (match) => {
    const inner = match.replace(/<\/?blockquote>/g, '').trim().replace(/\n/g, '<br />');
    return `<blockquote>${inner}</blockquote>\n`;
  });

  // Images: ![alt | optional caption](url) or ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, altRaw: string, rawUrl: string) => {
    const safeSrc = sanitizeUrl(rawUrl);
    const parts = altRaw.split('|').map((s) => s.trim());
    const altText = parts[0] || 'Blog illustration';
    const caption = parts[1] !== undefined ? parts[1] : parts[0];
    return `<figure class="blog-figure"><img src="${safeSrc}" alt="${altText}" loading="lazy" />${
      caption ? `<figcaption>${caption}</figcaption>` : ''
    }</figure>`;
  });

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text: string, rawUrl: string) => {
    const safeHref = sanitizeUrl(rawUrl);
    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Unordered lists
  html = html.replace(/^[-*]\s+(.+)$/gm, '<ul-li>$1</ul-li>');
  html = html.replace(/(<ul-li>.*<\/ul-li>\n?)+/g, (match) => {
    const items = match.replace(/<ul-li>(.*?)<\/ul-li>/g, '<li>$1</li>');
    return `<ul>${items}</ul>\n`;
  });

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<ol-li>$1</ol-li>');
  html = html.replace(/(<ol-li>.*<\/ol-li>\n?)+/g, (match) => {
    const items = match.replace(/<ol-li>(.*?)<\/ol-li>/g, '<li>$1</li>');
    return `<ol>${items}</ol>\n`;
  });

  // Paragraphs: wrap remaining non-tag lines
  html = html.replace(/^(?!<[a-z/])(\S.*)$/gm, '<p>$1</p>');

  // Clean up extra blank lines
  html = html.replace(/\n{2,}/g, '\n');
  return html;
}

