// src/app/api/save-result/route.ts
import { NextResponse } from "next/server";
import { db } from "@/app/_utils/db/index";
import { results } from "@/app/_utils/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { entryId, questionnaireType, totalScore } = body;

    if (!entryId || !questionnaireType || totalScore == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(results)
      .values({ entryId: Number(entryId), questionnaireType, totalScore: Number(totalScore) })
      .returning();

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save result" },
      { status: 500 }
    );
  }
}
