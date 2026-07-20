import { SessionOptions } from "iron-session";

// ponytail: iron-session (7 methods) over NextAuth (overkill for email/pass only)
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "shipyard_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export interface SessionData {
  userId: string;
  username: string;
  email: string;
}
