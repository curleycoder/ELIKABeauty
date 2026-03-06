const mongoose = require("mongoose");
const Service = require("./models/service");
require("dotenv").config();

async function seed() {
  try {
    console.log("1. Starting seed...");

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    console.log("2. Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("3. Connected to MongoDB");

    const services = [
      {
        name: "Balayage",
        price: 220,
        fromPrice: true,
        duration: 240,
        category: "Hair",
        description: "Natural hand-painted highlights. Extra charge for base colour if needed.",
      },
      {
        name: "Women’s Haircut",
        price: 45,
        duration: 45,
        fromPrice: true,
        category: "Hair",
        description: "Professional haircut tailored to you.",
      },
      {
        name: "Keratin",
        price: 250,
        duration: 240,
        fromPrice: true,
        category: "Hair",
        description: "Smooth and straighten frizzy hair.",
      },
      {
        name: "Highlights",
        price: 200,
        duration: 210,
        fromPrice: true,
        category: "Hair",
        description: "Lighter strands to add dimension. Extra charge for base colour if needed.",
      },
      {
        name: "Root Colour",
        price: 80,
        duration: 90,
        category: "Hair",
        description: "Touch up your hair roots.",
      },
      {
        name: "Hair Colour",
        price: 120,
        duration: 120,
        fromPrice: true,
        category: "Hair",
        description: "All-over colour for a new look.",
      },
      {
        name: "Perm",
        price: 120,
        duration: 180,
        category: "Hair",
        description: "Add curls or waves to your hair.",
      },
      {
        name: "Hair Wash",
        price: 10,
        duration: 15,
        category: "Add-ons",
        description: "Quick wash and cleanse.",
      },
      {
        name: "Hair Wash + Style",
        price: 45,
        duration: 45,
        category: "Add-ons",
        description: "Wash and blow-dry styling.",
      },
      {
        name: "Base Colour",
        price: 70,
        duration: 30,
        fromPrice: true,
        category: "Add-ons",
        description:
          "Add a base colour to enhance your highlight or balayage. Great for full coverage or colour correction.",
      },
      {
        name: "Hair Styling",
        price: 35,
        duration: 45,
        category: "Hair",
        description: "Custom hairstyle for any event.",
      },
      {
        name: "Makeup",
        price: 80,
        duration: 60,
        category: "Face",
        description: "Professional makeup application.",
      },
      {
        name: "Eyebrow Threading",
        price: 17,
        duration: 20,
        category: "Face",
        description: "Define your brows naturally.",
      },
      {
        name: "Eyebrow Tinting",
        price: 10,
        duration: 10,
        category: "Face",
        description: "Tint for bolder brows.",
      },
      {
        name: "Full Face Threading",
        price: 40,
        duration: 30,
        category: "Face",
        description: "Remove facial hair by threading, including eyebrow threading.",
      },
      {
        name: "Facial Treatment",
        price: 85,
        duration: 60,
        category: "Face",
        description: "Deep cleansing facial with steam, mask, and skin-refreshing care.",
      },
      {
        name: "Microblading",
        price: 350,
        duration: 120,
        fromPrice: true,
        category: "Face",
        description: "PhiBrows microblading with single-use tools for natural-looking brows.",
      },
      {
        name: "Relaxation / Body Massage",
        price: 90,
        duration: 60,
        category: "Spa",
        description: "Spa-style body massage focused on relaxation and stress relief.",
      },
      {
        name: "Men’s Haircut",
        price: 25,
        duration: 30,
        category: "Men",
        description: "Wash available with additional charge.",
      },
      {
        name: "Men’s Haircut + Wash",
        price: 35,
        duration: 45,
        category: "Men",
        description: "Includes wash and haircut.",
      },
    ];

    console.log("4. Seeding services...");

    for (const service of services) {
      await Service.updateOne(
        { name: service.name },
        { $set: service },
        { upsert: true }
      );
      console.log(`✔ Seeded: ${service.name}`);
    }

    console.log("5. Done seeding");
  } catch (error) {
    console.error("❌ Seeding failed:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("6. Disconnected");
    process.exit(0);
  }
}

seed();