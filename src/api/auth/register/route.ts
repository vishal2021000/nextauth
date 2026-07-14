import {NextResponse, NextRequest} from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    // Validate input
    if(!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    //check from database if user already exists
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await User.create({ email, password });
    await newUser.save();
   
    // Return success response
    return NextResponse.json(
      { message: "User registered successfully" },
      
      { status: 201 }
    );
   
  } catch (error) {
    // Handle errors
    console.error("Error registering user:", error);
    // Return error response
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}