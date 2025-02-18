import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/dbConnect";
import Influencer from "@/models/Influencer";
import bcrypt from "bcryptjs";
import { generateToken } from "@/utils/jwt";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        await connectDB("influencer");

        const influencer = await Influencer.findOne({ email });
        if (!influencer) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, influencer.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        const token = generateToken({ id: influencer._id, role: "influencer" });

        return NextResponse.json(
            { message: "Login successful", token },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to login" },
            { status: 500 }
        );
    }
}
