const mongoose = require("mongoose");
const Service = require("./models/service");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const services = [
  {
    name: "Balayage",
    price: 220,
    fromPrice: true,
    duration: 210,
    category: "Hair",
    description: "Natural hand-painted highlights. Extra charge for base colour if needed.",
  },
{
    name: "Women's Haircut",
    price: 45,
    duration: 45,
    fromPrice: true,
    category: "Hair",
    description: "Professional haircut tailored to you. Wash and style available as an add-on.",
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
    fromPrice: true,
    duration: 180,
    category: "Hair",
    description: "Add curls or waves to your hair.",
  },
  {
    name: "Hair Wash",
    price: 10,
    duration: 15,
    category: "Add ons",
    description: "Quick wash and cleanse.",
  },
  {
    name: "Hair Wash + Style",
    price: 45,
    duration: 45,
    category: "Add ons",
    description: "Wash and blow-dry styling.",
  },
  {
    name: "Base Colour",
    price: 70,
    duration: 30,
    fromPrice: true,
    category: "Add ons",
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
    price: 80,
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
    description:
      "PhiBrows microblading with single-use tools for natural-looking brows.",
  },
  {
    name: "Relaxation / Body Massage",
    price: 80,
    duration: 60,
    category: "Spa",
    description: "Spa-style body massage focused on relaxation and stress relief.",
  },
  {
    name: "Men’s Haircut",
    price: 30,
    fromPrice: true,
    duration: 30,
    category: "Men",
    description: "Wash available with additional charge.",
  },
  {
    name: "Men’s Haircut + Wash",
    price: 45,
    duration: 45,
    category: "Men",
    description: "Includes wash and haircut.",
  },
    {
    name: "Men’s Hair Colour",
    price: 45,
    duration: 60,
    category: "Men",
    description: "All-over colour for a new look.",
  },
];

async function seed() {
  try {
    await Service.deleteMany();
    await Service.insertMany(services);
    console.log("✅ Services seeded");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();