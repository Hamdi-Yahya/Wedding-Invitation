const { PrismaClient } = require("@prisma/client/default");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.admin.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password: hashedPassword,
        },
    });
    console.log("✅ Admin created:", admin.username);

    await prisma.eventSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            partner1Name: "Sarah",
            partner2Name: "Michael",
            tagline: "Two souls, one heart, forever together",
            eventDate: new Date("2024-09-05"),
            startTime: "10:00",
            endTime: "22:00",
            venueName: "Rosewood Estate Gardens",
            venueAddress: "123 Blossom Lane, Beverly Hills, CA 90210",
            mapLinkUrl: "https://maps.google.com/?q=Rosewood+Estate+Gardens",
            waTemplateMsg:
                "Halo {nama}, kami mengundang Anda ke pernikahan kami. Info lengkap: {link}",
        },
    });
    console.log("✅ Event settings created");

    await prisma.themeSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            themeName: "Modern Pink",
            primaryColor: "#E91E8C",
            secondaryColor: "#FFF9F9",
            fontFamily: "Parisienne",
            backgroundImageUrl: null,
        },
    });
    console.log("✅ Theme settings created");

    const sampleGuest = await prisma.guest.upsert({
        where: { slug: "john-doe" },
        update: {},
        create: {
            name: "John Doe",
            phoneNumber: "081234567890",
            category: "VIP",
            slug: "john-doe",
            qrCodeString: "WEDDING-JOHNDOE-12345",
            rsvpStatus: "Pending",
            guestCount: 2,
        },
    });
    console.log("✅ Sample guest created:", sampleGuest.name);

    console.log("🎉 Seed completed successfully!");
    console.log("\n📌 Test invitation URL: http://localhost:3000/invite/john-doe");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
