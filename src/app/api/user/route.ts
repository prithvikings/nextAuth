import authoptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User } from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Logic to get user data
  try {
    await dbConnect();
    const session = await getServerSession(authoptions);
    if (!session  || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user= await User.findById(session.user.id).select("-password");
    if(!user){
        return NextResponse.json({error:"User not found"},{status:404})
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Internal Server Error: ${err}` }, { status: 500 });
  }
}
