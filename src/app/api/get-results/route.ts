// src/app/api/get-results/route.ts
import { NextResponse } from "next/server";
import { db } from "@/app/_utils/db/index";
import { results } from "@/app/_utils/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const entryId = Number(url.searchParams.get("entryId"));

    if (!entryId) {
      return NextResponse.json({ error: "Missing entryId" }, { status: 400 });
    }

    // Get only the most recent record
    const lastResult = await db
      .select({
        id: results.id,
        questionnaireType: results.questionnaireType,
        totalScore: results.totalScore,
        created_at: results.created_at,
      })
      .from(results)
      .where(eq(results.entryId, entryId))
      .orderBy(desc(results.created_at))
      .limit(1);

    return NextResponse.json({
      result: lastResult.length ? lastResult[0] : null,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
