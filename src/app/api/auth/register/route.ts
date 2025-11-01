import dbConnect from "@/lib/db";
import { User } from "@/model/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  await dbConnect();

  if (!name || !email || !password) {
    return new Response(
      JSON.stringify({ message: "Name, email, and password are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(
      JSON.stringify({ message: "User is already registered" }),
      {
        status: 409,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (password.length < 6) {
    return new Response(
      JSON.stringify({
        message: "Password must be at least 6 characters long",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  return new Response(
    JSON.stringify({ message: "User registered successfully", email }),
    {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }
  );
}

//   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     return new Response(JSON.stringify({ message: 'Invalid email format' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   if(email.endsWith('@example.com')) {
//     return new Response(JSON.stringify({ message: 'Registration using example.com emails is not allowed' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
