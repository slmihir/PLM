import { NextRequest, NextResponse } from 'next/server';

const AGENT_URL = process.env.AGENT_URL || 'ws://localhost:5000';

export async function POST(req: NextRequest) {
  try {
    const { message, persona, sessionId } = await req.json();

    // In real implementation, connect to WebSocket agent
    // For now, return a mock response
    return NextResponse.json({
      response: `Agent received: ${message}`,
      sessionId: sessionId || 'session-123',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

