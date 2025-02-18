import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/dbConnect";
import Influencer from "@/models/Influencer";

export async function POST(request: NextRequest) {
    try {
        const { email, password, name, category, socialLinks } = await request.json();

        if (!email || !password || !name || !category) {
            return NextResponse.json(
                { error: "All fields (email, password, name, category) are required" },
                { status: 400 }
            );
        }

        await connectDB("influencer");

        const existingInfluencer = await Influencer.findOne({ email });
        if (existingInfluencer) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        await Influencer.create({
            email,
            password,
            name,
            category,
            socialLinks,
        });

        return NextResponse.json(
            { message: "Influencer registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to register Influencer" },
            { status: 500 }
        );
    }
}
