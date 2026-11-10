import { NextRequest, NextResponse } from 'next/server';
import { updateBridgeStatus } from '@/lib/storage';
import { revalidatePath } from 'next/cache';

async function handleScrape(req: NextRequest) {
  // If CRON_SECRET is configured, enforce bearer authentication
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const updated = await updateBridgeStatus();
    revalidatePath('/');
    return NextResponse.json({
      success: true,
      message: 'Bridge status scraped successfully',
      data: updated,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleScrape(req);
}

export async function POST(req: NextRequest) {
  return handleScrape(req);
}
