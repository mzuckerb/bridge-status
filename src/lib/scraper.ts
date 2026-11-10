import * as cheerio from 'cheerio';
import { BridgeState, ScrapeResult } from './types';

export const TARGET_URL = 'https://park.co.il/';

/**
 * Scrapes park.co.il for Sheva Tahanot bridge status
 */
export async function scrapeBridgeStatus(): Promise<ScrapeResult> {
  const checkedAt = new Date().toISOString();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(TARGET_URL, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'he,en;q=0.9',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Target the specific bridge status container
    const statusContainer = $('.bridge-status');
    let rawText = '';
    let sourceDate = '';

    if (statusContainer.length > 0) {
      rawText = statusContainer.find('p').text().trim() || statusContainer.text().trim();
      sourceDate = statusContainer.find('.date').text().trim();
    } else {
      // Fallback: search for "שבע טחנות" anywhere in the document
      const fallbackMatch = html.match(/(?:שבע\s+טחנות[^\n<]{0,30}(?:פתוח|סגור))/i);
      if (fallbackMatch) {
        rawText = fallbackMatch[0].trim();
      }
    }

    // Determine state from text
    let status: BridgeState = 'UNKNOWN';
    if (rawText.includes('פתוח')) {
      status = 'OPEN';
    } else if (rawText.includes('סגור')) {
      status = 'CLOSED';
    }

    return {
      status,
      rawText: rawText || 'לא נמצא מידע',
      sourceDate: sourceDate || 'לא צוין תאריך',
      checkedAt,
      success: status !== 'UNKNOWN',
      error: status === 'UNKNOWN' ? 'Bridge status not definitively recognized' : null,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      status: 'UNKNOWN',
      rawText: 'שגיאה בבדיקת האתר',
      sourceDate: '',
      checkedAt,
      success: false,
      error: errorMsg,
    };
  }
}
