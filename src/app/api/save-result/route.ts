// src/app/api/save-result/route.ts
import { NextResponse } from "next/server";
import { db } from "@/app/_utils/db/index";
import { results } from "@/app/_utils/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { entryId, questionnaireType, totalScore, user_id } = body;

    // IMPROVED CHECK: totalScore can be 0, so we check for null/undefined specifically
    // user_id must be present and not "null"/"undefined" as a string
    if (!entryId || !questionnaireType || totalScore === undefined || !user_id) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }
    console.log(user_id, typeof user_id)
    const parsedUserId = Number(user_id);
    const parsedTotalScore = Number(totalScore);
    const parsedEntryId = Number(entryId);

    // Final safety check: Ensure we didn't get NaN
    if (isNaN(parsedUserId) || isNaN(parsedTotalScore)) {
        return NextResponse.json({ error: "Invalid numeric data" }, { status: 400 });
    }

    const result = await db
      .insert(results)
      .values({ 
        entryId: parsedEntryId, 
        questionnaireType, 
        totalScore: parsedTotalScore, 
        user_id: parsedUserId 
      })
      .returning();

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("DATABASE ERROR:", err); // Check your terminal for this log!
    return NextResponse.json(
      { error: "Failed to save result" },
      { status: 500 }
    );
  }
}
