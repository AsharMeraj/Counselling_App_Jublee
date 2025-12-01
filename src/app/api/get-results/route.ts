// src/app/api/get-results/route.ts
import { NextResponse } from "next/server";
import { db } from "@/app/_utils/db/index";
import { results, all_entries } from "@/app/_utils/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const entryId = Number(url.searchParams.get("entryId"));

        if (!entryId) {
            return NextResponse.json({ error: "Missing entryId" }, { status: 400 });
        }

        // Fetch all questionnaire results for this entry

        const res = await db
            .select({
                id: results.id,
                questionnaireType: results.questionnaireType,
                totalScore: results.totalScore,
            })
            .from(results)
            .where(eq(results.entryId, entryId));


        return NextResponse.json({ results: res });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
    }
}
