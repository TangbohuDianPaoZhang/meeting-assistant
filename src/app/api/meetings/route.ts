import { createMeeting, listMeetings } from "@/lib/meeting-store";
import { z } from "zod";

const createMeetingSchema = z.object({
  title: z.string().min(1).max(120),
});

export async function GET() {
  return Response.json({ meetings: listMeetings() });
}

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null);
  const parsed = createMeetingSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const meeting = createMeeting(parsed.data.title);
  return Response.json({ meeting }, { status: 201 });
}
