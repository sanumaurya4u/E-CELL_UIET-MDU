import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface ExtractedArticle {
  title: string;
  excerpt: string;
  author: string;
  published_at: string;
  image_url: string;
  content: string;
  source_name: string;
  source_url: string;
}

function extractMeta(html: string, property: string): string {
  // Try og: and name variants
  const ogMatch = html.match(
    new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i')
  );
  if (ogMatch) return ogMatch[1];
  // Try reversed attribute order
  const reversed = html.match(
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`, 'i')
  );
  return reversed ? reversed[1] : '';
}

function extractTitle(html: string): string {
  const og = extractMeta(html, 'og:title');
  if (og) return og;
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : '';
}

function extractHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractArticleContent(html: string, title: string, sourceName: string, sourceUrl: string): string {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '');

  const articleMatch = cleaned.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const mainMatch = cleaned.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const sourceHtml = articleMatch?.[1] || mainMatch?.[1] || cleaned;

  const blocks: string[] = [];
  const blockRegex = /<(h2|h3|p|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  let charCount = 0;

  while ((match = blockRegex.exec(sourceHtml)) !== null && charCount < 2400) {
    const tag = match[1].toLowerCase();
    const text = stripHtml(match[2]);
    if (!text || text.length < 25) continue;

    if (tag === 'h2') {
      blocks.push(`## ${text}`);
    } else if (tag === 'h3') {
      blocks.push(`### ${text}`);
    } else if (tag === 'blockquote') {
      blocks.push(`> ${text}`);
    } else {
      blocks.push(text);
    }
    charCount += text.length;
  }

  const desc = extractMeta(html, 'og:description') || extractMeta(html, 'description') || '';

  if (blocks.length > 0) {
    return [
      `## Key Highlights & Summary`,
      blocks.slice(0, 8).join('\n\n'),
      `---`,
      `> *Editorial Note: This article summarizes key insights originally published by **${sourceName || 'the source publication'}**. Review, rewrite, and customize this draft before publishing.*`,
    ].join('\n\n');
  }

  return desc
    ? `## Overview\n\n${desc}\n\n---\n\n> *Source: [${title || sourceName}](${sourceUrl})*`
    : '';
}


export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'A valid URL is required.' },
        { status: 400 }
      );
    }

    // Validate URL format & protocol
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format.' },
        { status: 400 }
      );
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ECellBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL (HTTP ${response.status}).` },
        { status: 422 }
      );
    }

    const html = await response.text();
    const title = extractTitle(html);
    const sourceName = extractMeta(html, 'og:site_name') || extractHostname(url);
    const rawImage = extractMeta(html, 'og:image') || extractMeta(html, 'twitter:image') || '';
    let resolvedImage = rawImage;
    if (rawImage && !rawImage.startsWith('http')) {
      try {
        resolvedImage = new URL(rawImage, parsedUrl.origin).toString();
      } catch {
        resolvedImage = '';
      }
    }

    const extracted: ExtractedArticle = {
      title,
      excerpt: extractMeta(html, 'og:description') || extractMeta(html, 'description') || '',
      author: extractMeta(html, 'article:author') || extractMeta(html, 'author') || '',
      published_at: extractMeta(html, 'article:published_time') || '',
      image_url: resolvedImage,
      content: extractArticleContent(html, title, sourceName, url),
      source_name: sourceName,
      source_url: url,
    };

    return NextResponse.json({ success: true, data: extracted });
  } catch (err: any) {
    const message = err?.name === 'TimeoutError'
      ? 'Request timed out. The URL may be unreachable.'
      : 'Failed to extract article information.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
