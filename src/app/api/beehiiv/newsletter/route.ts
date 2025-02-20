import { NextResponse } from "next/server";
import { subscribe_to_beehiiv_newsletter_async } from "@/services/api/beehiiv.api";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  // Short-circuit if Beehiiv is not configured
  if (!process.env.NEXT_BEEHIIV_API_KEY || !process.env.NEXT_BEEHIIV_PUBLICATION_ID) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    await subscribe_to_beehiiv_newsletter_async(email);
    return NextResponse.json("Success ! Check your email.", { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
