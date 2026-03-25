export interface TingwuTranscriptEvent {
  meetingId: string;
  speakerName: string;
  text: string;
  language?: string;
  isFinal?: boolean;
}

export interface TingwuAdapter {
  connect: (meetingId: string) => Promise<void>;
  disconnect: (meetingId: string) => Promise<void>;
}

// This adapter is intentionally lightweight in MVP.
// Replace with Alibaba Tingwu websocket integration in the next iteration.
export const tingwuAdapter: TingwuAdapter = {
  async connect() {
    return;
  },
  async disconnect() {
    return;
  },
};
