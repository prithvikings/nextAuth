import uploadOnCloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import { User } from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
    const formdata = await req.formData();
    const name = formdata.get("name") as string;
    const file = formdata.get("file") as Blob | null;

    let imageUrl = session.user.image as string | null;

    if (file) {
      imageUrl = await uploadOnCloudinary(file);
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        name,
        image: imageUrl,
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
