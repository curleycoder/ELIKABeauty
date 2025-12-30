const services = [
  { id: "balayage", name: "Balayage", price: 180, fromPrice: true, duration: 240, category: "Hair", description: "Natural hand-painted highlights. Extra charge for base color if needed" },
  { id: "hair-cut", name: "Hair Cut", price: 45, fromPrice: true, duration: 45, category: "Hair", description: "Professional haircut tailored to you." },
  { id: "keratin", name: "Keratin", price: 250, fromPrice: true, duration: 240, category: "Hair", description: "Smooth and straighten frizzy hair." },
  { id: "highlight", name: "Highlight", price: 180, fromPrice: true, duration: 210, category: "Hair", description: "Lighter strands to add dimension. Extra charge for base color if needed" },
  { id: "root-colour", name: "Root Colour", price: 65, duration: 90, category: "Hair", description: "Touch up your hair roots." },
  { id: "hair-color", name: "Hair Color", price: 120, fromPrice: true, duration: 120, category: "Hair", description: "All-over color for a new look." },
  { id: "perms", name: "Perms", price: 120, duration: 180, category: "Hair", description: "Add curls or waves to your hair." },

  { id: "hair-wash", name: "Hair Wash", price: 10, duration: 15, category: "Add-ons", description: "Quick wash and cleanse." },
  { id: "hair-wash-style", name: "Hair Wash + Style", price: 45, duration: 45, category: "Add-ons", description: "Wash and blow-dry styling." },

  // ✅ FIXED CATEGORY: was "Add-ones" (typo) which breaks your filtering
  { id: "base-color", name: "Base Color", price: 50, duration: 30, fromPrice: true, category: "Add-ons", description: "Add a base color to enhance your highlight or balayage. Great for full coverage or color correction." },

  { id: "hair-styling", name: "Hair Styling", price: 35, duration: 45, category: "Hair", description: "Custom hairstyle for any event." },

  { id: "makeup", name: "Makeup", price: 80, duration: 60, category: "Face", description: "Professional makeup application." },
  { id: "microblading", name: "Microblading", price: 300, duration: 120, category: "Face", description: "Semi-permanent eyebrow shaping, lip blush, eyeliner." },
  { id: "brow-threading", name: "Eyebrows Threading", price: 15, duration: 20, category: "Face", description: "Define your brows naturally." },
  { id: "brow-tinting", name: "Eyebrows Tinting", price: 10, duration: 10, category: "Face", description: "Tint for bolder brows." },
  { id: "full-threading", name: "Full Threading", price: 35, duration: 30, category: "Face", description: "Remove facial hair by threading + Eyebrow Threading." },
  { id: "facial", name: "Facial", price: 80, duration: 45, category: "Face", description: "Cleanse, exfoliate, and glow." },

  { id: "men-cut", name: "Men Hair Cut", price: 25, duration: 30, category: "Men", description: "Wash available with additional charge." },
  { id: "men-cut-wash", name: "Men Hair Cut + Wash", price: 40, duration: 45, category: "Men", description: "Includes wash and haircut." }
];

export default services;
