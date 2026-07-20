import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({});
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (session.userId && session.email) {
      return NextResponse.json({ user: { id: session.userId, email: session.email } });
    }

    return NextResponse.json({ user: null });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null });
  }
}
