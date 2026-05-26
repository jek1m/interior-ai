import { NextResponse } from "next/server";
import { db } from "../../../config/db";
import { Users } from "../../../config/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const { user } = await req.json();

  try {
    const email = user?.primaryEmailAddress?.emailAddress;

    const userInfo = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email));

    console.log("User:", userInfo);

    if (userInfo?.length === 0) {
      const saveResult = await db
        .insert(Users)
        .values({
          name: user?.fullName ?? "No Name",
          email: email,
          imageUrl: user?.imageUrl ?? "",
        })
        .returning();

      return NextResponse.json({ result: saveResult[0] });
    }

    return NextResponse.json({ result: userInfo[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}