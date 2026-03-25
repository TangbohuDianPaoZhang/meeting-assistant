import { detectSentiment, extractActionItems, updateSummary } from "@/lib/analysis";
import { IngestEventInput, Meeting, TranscriptSegment } from "@/types/meeting";

const meetings = new Map<string, Meeting>();

function createEmptyMeeting(id: string, title: string): Meeting {
  const now = new Date().toISOString();
  return {
    id,
    title,
    createdAt: now,
    participants: [],
    transcript: [],
    actions: [],
    sentiments: [],
    summary: {
      topics: [],
      decisions: [],
      risks: [],
      nextActions: [],
      updatedAt: now,
    },
  };
}

export function createMeeting(title: string): Meeting {
  const id = `m_${crypto.randomUUID()}`;
  const meeting = createEmptyMeeting(id, title);
  meetings.set(id, meeting);
  return meeting;
}

export function getMeeting(id: string): Meeting | null {
  return meetings.get(id) ?? null;
}

export function listMeetings(): Meeting[] {
  return Array.from(meetings.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function ingestTranscriptEvent(meetingId: string, input: IngestEventInput): Meeting | null {
  const meeting = meetings.get(meetingId);
  if (!meeting) return null;

  const now = Date.now();
  const segment: TranscriptSegment = {
    id: `seg_${crypto.randomUUID()}`,
    meetingId,
    speakerId: input.speakerName.trim().toLowerCase().replace(/\s+/g, "-") || "unknown",
    speakerName: input.speakerName,
    text: input.text,
    language: input.language || "auto",
    startMs: now,
    endMs: now + 1200,
    isFinal: input.isFinal ?? true,
    createdAt: new Date().toISOString(),
  };

  meeting.transcript.push(segment);

  if (input.speakerName && !meeting.participants.find((p) => p.name === input.speakerName)) {
    meeting.participants.push({
      id: segment.speakerId,
      name: input.speakerName,
    });
  }

  const actionItems = extractActionItems(segment);
  if (actionItems.length) {
    meeting.actions.push(...actionItems);
  }

  const sentimentMoment = detectSentiment(segment);
  if (sentimentMoment) {
    meeting.sentiments.push(sentimentMoment);
  }

  meeting.summary = updateSummary(meeting, segment);
  return meeting;
}
