import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/app/_utils/db/index";
import { users } from "@/app/_utils/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    const { name, password } = await request.json();

    const [user] = await db.select().from(users).where(eq(users.name, name)).limit(1);

    if (!user || user.password !== password) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("user_session", user.name, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 1 day * 30
    });

    return NextResponse.json({ message: "Logged in", user_id: user.id });
}