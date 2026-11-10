export type BridgeState = 'OPEN' | 'CLOSED' | 'UNKNOWN';

export interface ScrapeResult {
  status: BridgeState;
  rawText: string;
  sourceDate: string;
  checkedAt: string;
  success: boolean;
  error?: string | null;
}

export interface StatusHistoryItem {
  id: string;
  timestamp: string;
  status: BridgeState;
  rawText: string;
  sourceDate: string;
}

export interface BridgeStatusData {
  id: string;
  nameHe: string;
  nameEn: string;
  status: BridgeState;
  rawText: string;
  sourceDate: string;
  lastCheckedAt: string;
  nextScheduledCheckAt: string;
  history: StatusHistoryItem[];
  error?: string | null;
}
