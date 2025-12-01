// src/app/api/save-entry/route.ts
import { NextResponse } from "next/server";
import { db } from "@/app/_utils/db/index";
import { all_entries } from "@/app/_utils/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, age, gender, phoneNumber } = body;

    // Insert demographic
    const entry = await db
      .insert(all_entries)
      .values({ name, age: Number(age), gender, phoneNumber })
      .returning();

    // Return the entryId for linking questionnaire results
    return NextResponse.json({ success: true, entryId: entry[0].id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add entry" },
      { status: 500 }
    );
  }
}
