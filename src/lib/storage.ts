import fs from 'fs';
import path from 'path';
import { BridgeStatusData, ScrapeResult, StatusHistoryItem } from './types';
import { getNextScheduledCheck } from './schedule';
import { scrapeBridgeStatus } from './scraper';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'status.json');

// In-memory cache for serverless environments
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
 * Performs a live scrape on demand with fallback to cached/stored data.
 */
export async function getStoredStatus(forceFresh: boolean = false): Promise<BridgeStatusData> {
  const diskData = readDiskData();
  const current = memoryData || diskData;

  // If we already have fresh data from less than 60 seconds ago, reuse it
  if (current && !forceFresh) {
    const ageSeconds = (Date.now() - new Date(current.lastCheckedAt).getTime()) / 1000;
    if (ageSeconds < 60) {
      return current;
    }
  }

  // Perform a live scrape to always have the latest real data
  try {
    const liveResult = await scrapeBridgeStatus();
    if (liveResult.success) {
      return await updateBridgeStatus(liveResult);
    }
  } catch (err) {
    console.error('Error in live scrape:', err);
  }

  return current || {
    id: 'sheva_tahanot',
    nameHe: 'שבע טחנות',
    nameEn: 'Sheva Tahanot',
    status: 'OPEN',
    rawText: 'שבע טחנות פתוח',
    sourceDate: '',
    lastCheckedAt: new Date().toISOString(),
    nextScheduledCheckAt: getNextScheduledCheck().toISOString(),
    history: [],
    error: null,
  };
}

export async function updateBridgeStatus(forcedResult?: ScrapeResult): Promise<BridgeStatusData> {
  const result = forcedResult ?? (await scrapeBridgeStatus());
  const current = memoryData || readDiskData();

  const nextCheck = getNextScheduledCheck(new Date());

  const newHistoryItem: StatusHistoryItem = {
    id: `${Date.now()}`,
    timestamp: result.checkedAt,
    status: result.status,
    rawText: result.rawText,
    sourceDate: result.sourceDate,
  };

  const existingHistory = current?.history || [];
  // Avoid duplicate adjacent history items if same status and date
  const isDuplicate =
    existingHistory.length > 0 &&
    existingHistory[0].status === result.status &&
    existingHistory[0].sourceDate === result.sourceDate;

  const updatedHistory = isDuplicate
    ? existingHistory
    : [newHistoryItem, ...existingHistory].slice(0, 30);

  const updatedData: BridgeStatusData = {
    id: 'sheva_tahanot',
    nameHe: 'שבע טחנות',
    nameEn: 'Sheva Tahanot',
    status: result.status !== 'UNKNOWN' ? result.status : (current?.status ?? 'UNKNOWN'),
    rawText: result.rawText,
    sourceDate: result.sourceDate,
    lastCheckedAt: result.checkedAt,
    nextScheduledCheckAt: nextCheck.toISOString(),
    history: updatedHistory,
    error: result.error,
  };

  memoryData = updatedData;
  writeDiskData(updatedData);

  return updatedData;
}
