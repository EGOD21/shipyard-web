import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";
import { userKeys } from "@/lib/kv-helpers";
import { User } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate
    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Check if user exists
    const existing = await kv.get<User>(userKeys.byEmail(email));
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Create user
    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = {
      id,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    await kv.set(userKeys.byEmail(email), user);
    await kv.set(userKeys.byId(id), email);

    // Create session
    const response = NextResponse.json({ success: true, user: { id, email } });
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    session.userId = id;
    session.email = email;
    await session.save();

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
