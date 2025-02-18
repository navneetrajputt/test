import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/dbConnect";
import Brand from "@/models/Brand";

export async function POST(request: NextRequest) {
    try {
        const { email, password, name, industry, website, socialMedia } = await request.json();

        if (!email || !password || !name || !industry) {
            return NextResponse.json(
                { error: "All fields (email, password, name, industry) are required" },
                { status: 400 }
            );
        }

        await connectDB("brand");

        const existingBrand = await Brand.findOne({ email });
        if (existingBrand) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        await Brand.create({
            email,
            password,
            name,
            industry,
            website,
            socialMedia,
        });

        return NextResponse.json(
            { message: "Brand registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to register Brand" },
            { status: 500 }
        );
    }
}
