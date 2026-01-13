import { NextResponse } from "next/server";
import { db } from "@/app/_utils/db/index";
import { all_entries } from "@/app/_utils/db/schema";
import { eq } from "drizzle-orm"; // Necessary for the update condition

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Destructure entryId from the body
    const { 
      entryId, 
      name, 
      father_husband, 
      age, 
      gender, 
      profession, 
      qualification, 
      phoneNumber, 
      user_id 
    } = body;

    let finalEntry;

    // 2. Logic: If entryId exists, UPDATE. Otherwise, INSERT.
    if (entryId) {
      // --- UPDATE EXISTING RECORD ---
      const updated = await db
        .update(all_entries)
        .set({
          name,
          father_husband,
          age: Number(age),
          gender,
          profession,
          qualification,
          phoneNumber,
          user_id: Number(user_id),
        })
        .where(eq(all_entries.id, Number(entryId))) // Find the record by ID
        .returning();
      
      finalEntry = updated[0];
    } else {
      // --- INSERT NEW RECORD ---
      const inserted = await db
        .insert(all_entries)
        .values({
          name,
          father_husband,
          age: Number(age),
          gender,
          profession,
          qualification,
          phoneNumber,
          user_id: Number(user_id),
        })
        .returning();
      
      finalEntry = inserted[0];
    }

    // 3. Return the ID (either the one we just created or the one we just updated)
    return NextResponse.json({ 
      success: true, 
      entryId: finalEntry.id,
      message: entryId ? "Entry updated successfully" : "New entry created"
    });

  } catch (err) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { error: "Failed to process entry" },
      { status: 500 }
    );
  }
}