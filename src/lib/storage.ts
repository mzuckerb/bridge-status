import fs from 'fs';
import path from 'path';
import { BridgeStatusData, ScrapeResult } from './types';
import { getNextScheduledCheck } from './schedule';
import { scrapeBridgeStatus } from './scraper';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'status.json');

const INITIAL_DATA: BridgeStatusData = {
  id: 'sheva_tahanot',
  nameHe: 'שבע טחנות',
  nameEn: 'Sheva Tahanot',
  status: 'OPEN',
  rawText: 'שבע טחנות פתוח',
  sourceDate: '10/11/2026',
  lastCheckedAt: new Date().toISOString(),
  nextScheduledCheckAt: getNextScheduledCheck().toISOString(),
  history: [
    {
      id: 'init_1',
      timestamp: new Date().toISOString(),
      status: 'OPEN',
      rawText: 'שבע טחנות פתוח',
      sourceDate: '10/11/2026',
    },
  ],
  error: null,
};

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring data file:', err);
  }
}

export async function getStoredStatus(): Promise<BridgeStatusData> {
  ensureDataFile();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content) as BridgeStatusData;
    }
  } catch (err) {
    console.error('Error reading status file, returning initial state:', err);
  }
  return INITIAL_DATA;
}

export async function updateBridgeStatus(forcedResult?: ScrapeResult): Promise<BridgeStatusData> {
  ensureDataFile();
  const result = forcedResult ?? (await scrapeBridgeStatus());
  const current = await getStoredStatus().catch(() => INITIAL_DATA);

  const nextCheck = getNextScheduledCheck(new Date());

  // Add to history (keep latest 50 entries)
  const newHistoryItem = {
    id: `${Date.now()}`,
    timestamp: result.checkedAt,
    status: result.status,
    rawText: result.rawText,
    sourceDate: result.sourceDate,
  };

  const updatedHistory = [newHistoryItem, ...(current.history || [])].slice(0, 50);

  const updatedData: BridgeStatusData = {
    id: 'sheva_tahanot',
    nameHe: 'שבע טחנות',
    nameEn: 'Sheva Tahanot',
    status: result.status !== 'UNKNOWN' ? result.status : current.status,
    rawText: result.rawText,
    sourceDate: result.sourceDate,
    lastCheckedAt: result.checkedAt,
    nextScheduledCheckAt: nextCheck.toISOString(),
    history: updatedHistory,
    error: result.error,
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing status file:', err);
  }

  return updatedData;
}
