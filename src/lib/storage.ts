import fs from 'fs';
import path from 'path';
import { BridgeStatusData, ScrapeResult, StatusHistoryItem } from './types';
import { getLastScheduledCheck, getNextScheduledCheck } from './schedule';
import { scrapeBridgeStatus } from './scraper';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'status.json');

// Memory cache for serverless environments
let memoryData: BridgeStatusData | null = null;

function readDiskData(): BridgeStatusData | null {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content) as BridgeStatusData;
    }
  } catch (err) {
    console.error('Error reading disk status:', err);
  }
  return null;
}

function writeDiskData(data: BridgeStatusData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Read-only filesystem in cloud serverless; safely ignore disk write errors
  }
}

/**
 * Gets the current bridge status.
 * Reflects the 07:00 / 17:00 schedule and scrapes without spamming duplicates.
 */
export async function getStoredStatus(forceFresh: boolean = false): Promise<BridgeStatusData> {
  const diskData = readDiskData();
  const current = memoryData || diskData;

  const now = new Date();
  const lastScheduled = getLastScheduledCheck(now);
  const nextScheduled = getNextScheduledCheck(now);

  // If we have data and it's not a forced refresh, reuse cache for 10 minutes to avoid re-scraping on every page click
  if (current && !forceFresh) {
    const ageSeconds = (Date.now() - new Date(current.lastCheckedAt).getTime()) / 1000;
    if (ageSeconds < 600) {
      // Just keep schedule timestamps accurate
      return {
        ...current,
        lastScheduledCheckAt: lastScheduled.toISOString(),
        nextScheduledCheckAt: nextScheduled.toISOString(),
      };
    }
  }

  // Perform scrape
  try {
    const liveResult = await scrapeBridgeStatus();
    if (liveResult.success) {
      return await updateBridgeStatus(liveResult);
    }
  } catch (err) {
    console.error('Error in live scrape:', err);
  }

  return (
    current || {
      id: 'sheva_tahanot',
      nameHe: 'שבע טחנות',
      nameEn: 'Sheva Tahanot',
      status: 'OPEN',
      rawText: 'שבע טחנות פתוח',
      sourceDate: '',
      lastCheckedAt: now.toISOString(),
      lastScheduledCheckAt: lastScheduled.toISOString(),
      nextScheduledCheckAt: nextScheduled.toISOString(),
      history: [],
      error: null,
    }
  );
}

export async function updateBridgeStatus(forcedResult?: ScrapeResult): Promise<BridgeStatusData> {
  const result = forcedResult ?? (await scrapeBridgeStatus());
  const current = memoryData || readDiskData();

  const now = new Date();
  const lastScheduled = getLastScheduledCheck(now);
  const nextScheduled = getNextScheduledCheck(now);

  const existingHistory = current?.history || [];

  // Avoid creating redundant history items on every page visit
  // Only add to history if status changed, source date changed, or history is empty
  const isDuplicate =
    existingHistory.length > 0 &&
    existingHistory[0].status === result.status &&
    existingHistory[0].sourceDate === result.sourceDate;

  let updatedHistory = existingHistory;
  if (!isDuplicate) {
    const newHistoryItem: StatusHistoryItem = {
      id: `${Date.now()}`,
      timestamp: lastScheduled.toISOString(), // Anchor history timestamp to the scheduled window
      status: result.status,
      rawText: result.rawText,
      sourceDate: result.sourceDate,
    };
    updatedHistory = [newHistoryItem, ...existingHistory].slice(0, 30);
  }

  const updatedData: BridgeStatusData = {
    id: 'sheva_tahanot',
    nameHe: 'שבע טחנות',
    nameEn: 'Sheva Tahanot',
    status: result.status !== 'UNKNOWN' ? result.status : (current?.status ?? 'UNKNOWN'),
    rawText: result.rawText,
    sourceDate: result.sourceDate,
    lastCheckedAt: now.toISOString(),
    lastScheduledCheckAt: lastScheduled.toISOString(),
    nextScheduledCheckAt: nextScheduled.toISOString(),
    history: updatedHistory,
    error: result.error,
  };

  memoryData = updatedData;
  writeDiskData(updatedData);

  return updatedData;
}
