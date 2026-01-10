import { NextResponse } from "next/server";
import { db } from "@/app/_utils/db/index"; 
import { users } from "@/app/_utils/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { name, password } = await request.json();

    if (!name || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if name exists
    const existingUser = await db.select().from(users).where(eq(users.name, name));
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Name already taken" }, { status: 400 });
    }

    // Saving password EXACTLY as typed (Plain Text)
    const insertedUser = await db.insert(users).values({
      name: name,
      password: password, 
    }).returning({insertedID: users.id})

    const GeneratedUserId = insertedUser[0].insertedID

    return NextResponse.json({ message: "User logged", user_id:  GeneratedUserId }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}