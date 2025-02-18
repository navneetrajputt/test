import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/dbConnect";
import Brand from "@/models/Brand";
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

        await connectDB("brand");

        const brand = await Brand.findOne({ email });
        if (!brand) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, brand.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        const token = generateToken({ id: brand._id, role: "brand" });

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
