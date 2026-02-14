import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const themeSettings = await prisma.themeSettings.findFirst({
            where: { id: 1 },
        });

        if (!themeSettings) {
            return NextResponse.json(null, { status: 404 });
        }

        return NextResponse.json(themeSettings);
    } catch (error) {
        console.error("Error fetching theme settings:", error);
        return NextResponse.json(
            { error: "Failed to fetch theme settings" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const themeSettings = await prisma.themeSettings.upsert({
            where: { id: 1 },
            update: {
                themeName: body.themeName,
                primaryColor: body.primaryColor,
                secondaryColor: body.secondaryColor,
                fontFamily: body.fontFamily,
                backgroundImageUrl: body.backgroundImageUrl || null,
            },
            create: {
                themeName: body.themeName,
                primaryColor: body.primaryColor,
                secondaryColor: body.secondaryColor,
                fontFamily: body.fontFamily,
                backgroundImageUrl: body.backgroundImageUrl || null,
            },
        });

        return NextResponse.json(themeSettings);
    } catch (error) {
        console.error("Error updating theme settings:", error);
        return NextResponse.json(
            { error: "Failed to update theme settings" },
            { status: 500 }
        );
    }
}
