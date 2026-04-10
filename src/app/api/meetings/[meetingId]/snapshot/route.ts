// src/app/api/meetings/[meetingId]/snapshot/route.ts
import { NextRequest, NextResponse } from 'next/server';

// 使用同一个存储
const meetingsStore = new Map<string, any>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params;  // ← 添加 await
    const meeting = meetingsStore.get(meetingId);
    
    console.log('[Snapshot API] 获取会议:', meetingId, meeting ? '存在' : '不存在');
    
    if (!meeting) {
      // 返回空会议而不是404
      return NextResponse.json({ 
        meeting: {
          id: meetingId,
          transcript: [],
          participants: [],
          actions: [],
          summary: { topics: [], decisions: [], nextActions: [] },
          sentiments: []
        }
      });
    }
    
    return NextResponse.json({ meeting });
  } catch (error) {
    console.error('[Snapshot API] 错误:', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}