const mongoose = require("mongoose");
const Service = require("./models/service");
require("dotenv").config()

mongoose.connect(process.env.MONGO_URI);

const services = [
  { name: "Balayage", price: 180, fromPrice: true, duration: 240, category: "Hair", description: "Natural hand-painted highlights.Extra charge for base color if needed" },
  { name: "Hair Cut", price: 35, duration: 45, fromPrice: true, category: "Hair", description: "Professional haircut tailored to you." },
  { name: "Keratin", price: 250, duration: 240,fromPrice: true, category: "Hair", description: "Smooth and straighten frizzy hair." },
  { name: "Highlight", price: 180, duration: 210, fromPrice: true, category: "Hair", description: "Lighter strands to add dimension. Extra charge for base color if needed" },
  { name: "Root Colour", price: 55, duration: 90, category: "Hair", description: "Touch up your hair roots." },
  { name: "Hair Color", price: 120, duration: 120, fromPrice: true, category: "Hair", description: "All-over color for a new look." },
  { name: "Perms", price: 120, duration: 180, category: "Hair", description: "Add curls or waves to your hair." },
  { name: "Hair Wash", price: 10, duration: 15, category: "Add-ons", description: "Quick wash and cleanse." },
  { name: "Hair Wash + Style", price: 45, duration: 45, category: "Add-ons", description: "Wash and blow-dry styling." },
  { name: "Base Color", price: 50, duration: 30, fromPrice: true, category: "Add-ones", description: "Add a base color to enhance your highlight or balayage. Great for full coverage or color correction."},
  { name: "Hair Styling", price: 35, duration: 45, category: "Hair", description: "Custom hairstyle for any event." },
  { name: "Makeup", price: 80, duration: 60, category: "Face", description: "Professional makeup application." },
  { name: "Microblading", price: 300, duration: 120, category: "Face", description: "Semi-permanent eyebrow shaping, lip blush, eyeliner." },
  { name: "Eyebrows treading", price: 15, duration: 20, category: "Face", description: "Define your brows naturally." },
  { name: "Eyebrows Tinting", price: 10, duration: 10, category: "Face", description: "Tint for bolder brows." },
  { name: "Full Treading", price: 35, duration: 30, category: "Face", description: "Remove facial hair by threading + Eyebrow Treading." },
  { name: "Facial", price: 80, duration: 45, category: "Face", description: "Cleanse, exfoliate, and glow." },
  { name: "Men Hair Cut", price: 25, duration: 30, category: "Men", description: "Wash available with additional charge." },
  { name: "Men Hair Cut + Wash", price: 40, duration: 45, category: "Men", description: "Includes wash and haircut." }
];

async function seed() {
  await Service.deleteMany();
  await Service.insertMany(services);
  console.log("✅ Services seeded");
  mongoose.disconnect();
}

seed();
