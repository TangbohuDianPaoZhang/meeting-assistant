// src/app/api/meetings/[meetingId]/events/route.ts
import { NextRequest, NextResponse } from 'next/server';

// 临时存储（实际项目中应该用数据库）
const meetingsStore = new Map<string, any>();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params;  // ← 添加 await
    const body = await request.json();
    const { speakerName, text, language, isFinal } = body;
    
    console.log('[Events API] 收到请求:', { meetingId, speakerName, text, language });
    
    // 获取或创建会议数据
    let meeting = meetingsStore.get(meetingId);
    if (!meeting) {
      meeting = {
        id: meetingId,
        transcript: [],
        participants: [],
        actions: [],
        summary: { topics: [], decisions: [], nextActions: [] },
        sentiments: []
      };
      meetingsStore.set(meetingId, meeting);
    }
    
    // 添加转录记录
    const newSegment = {
      id: Date.now().toString(),
      speakerName,
      text,
      language,
      translatedText: language === 'zh' ? text : `[待翻译] ${text}`,
      createdAt: new Date().toISOString()
    };
    
    meeting.transcript.push(newSegment);
    
    // 更新参与者列表
    if (!meeting.participants.includes(speakerName)) {
      meeting.participants.push(speakerName);
    }
    
    console.log('[Events API] 已添加转录，当前总数:', meeting.transcript.length);
    
    return NextResponse.json({ success: true, segment: newSegment });
  } catch (error) {
    console.error('[Events API] 错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}