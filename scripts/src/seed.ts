import { db, toursTable, tourDatesTable, motorcyclesTable } from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  const existingTours = await db.select().from(toursTable);
  if (existingTours.length > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  const [wineTour] = await db.insert(toursTable).values({
    name: "1 Day Wine Ride",
    slug: "1-day-wine-ride",
    description: "An unforgettable single day journey through Moldova's world-renowned wine country. Ride through picturesque vineyards, visit historic wine cellars, and taste some of the finest wines Eastern Europe has to offer. This tour takes you through the rolling hills of the Codru wine region, stopping at premium wineries and scenic viewpoints. Perfect for those looking to experience the essence of Moldova in a single day.",
    shortDescription: "A day journey through Moldova's wine country visiting historic cellars and vineyards.",
    durationDays: 1,
    priceEur: "220",
    maxRiders: 5,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    highlights: JSON.stringify(["Mileştii Mici wine cellar (world's largest underground wine city)", "Cricova winery tour and tasting", "Scenic Codru forest road ride", "Traditional Moldovan lunch", "Sunset over Ivancea hills"]),
    included: JSON.stringify(["Motorcycle rental", "Fuel", "Experienced guide", "Wine tasting at 2 wineries", "Lunch", "Safety equipment"]),
    isActive: true,
  }).returning();

  const [adventureTour] = await db.insert(toursTable).values({
    name: "3 Day Moldova Adventure",
    slug: "3-day-moldova-adventure",
    description: "Three days of pure adventure through the heart of Moldova. This tour combines the best of what the country has to offer — ancient monasteries perched on clifftops, medieval fortress ruins, dense forest trails, and charming village roads. You'll traverse the Orheiul Vechi canyon, explore Old Orhei's cave monasteries, ride through Rudi forest, and discover hidden gems that most tourists never see. Accommodation in comfortable guesthouses with authentic local food.",
    shortDescription: "Three days exploring monasteries, fortresses and scenic countryside of Moldova.",
    durationDays: 3,
    priceEur: "650",
    maxRiders: 5,
    imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800",
    highlights: JSON.stringify(["Orheiul Vechi cave monastery complex", "Soroca fortress on the Dniester River", "Rudi monastery in the northern forests", "Saharna waterfall and monastery", "Traditional village homestay experience", "Nistru river scenic viewpoints"]),
    included: JSON.stringify(["Motorcycle rental", "Fuel", "2 nights accommodation", "Daily breakfast and dinner", "Experienced guide", "Safety equipment", "Insurance"]),
    isActive: true,
  }).returning();

  const [grandTour] = await db.insert(toursTable).values({
    name: "5 Day Grand Moldova Tour",
    slug: "5-day-grand-moldova-tour",
    description: "The ultimate Moldova experience — five days covering the entire country from north to south. This comprehensive tour is for riders who want to see everything Moldova has to offer. From the northern forests and the majestic Dniester canyon to the southern steppes and the Gagauzia autonomous region, you'll experience Moldova's incredible diversity. Visit UNESCO-listed sites, cross into Transnistria for a unique Soviet-era adventure, and end with a gala dinner at one of Moldova's finest wineries.",
    shortDescription: "The ultimate 5-day journey covering all of Moldova's highlights from north to south.",
    durationDays: 5,
    priceEur: "1050",
    maxRiders: 5,
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
    highlights: JSON.stringify(["Complete north-to-south Moldova traverse", "Transnistria day trip (unique Soviet-era experience)", "Cahul thermal spa evening", "Gagauzia cultural immersion", "Taul manor house and gardens", "Gala farewell dinner at Chateau Vartely", "Exclusive riding on private estate roads"]),
    included: JSON.stringify(["Premium motorcycle rental", "All fuel", "4 nights accommodation (3-4 star)", "All meals", "Experienced guide + support vehicle", "Transnistria border assistance", "Full insurance", "Welcome dinner", "Farewell gala dinner"]),
    isActive: true,
  }).returning();

  const now = new Date();
  const dates = [];
  for (let i = 1; i <= 8; i++) {
    const start = new Date(now);
    start.setDate(start.getDate() + i * 14);
    dates.push(start);
  }

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  await db.insert(tourDatesTable).values([
    { tourId: wineTour.id, startDate: formatDate(dates[0]), endDate: formatDate(dates[0]), availableSpots: 5, maxRiders: 5, isActive: true },
    { tourId: wineTour.id, startDate: formatDate(dates[1]), endDate: formatDate(dates[1]), availableSpots: 5, maxRiders: 5, isActive: true },
    { tourId: wineTour.id, startDate: formatDate(dates[2]), endDate: formatDate(dates[2]), availableSpots: 4, maxRiders: 5, isActive: true },
    { tourId: wineTour.id, startDate: formatDate(dates[3]), endDate: formatDate(dates[3]), availableSpots: 5, maxRiders: 5, isActive: true },
    { tourId: adventureTour.id, startDate: formatDate(dates[0]), endDate: formatDate(new Date(dates[0].getTime() + 2 * 86400000)), availableSpots: 5, maxRiders: 5, isActive: true },
    { tourId: adventureTour.id, startDate: formatDate(dates[2]), endDate: formatDate(new Date(dates[2].getTime() + 2 * 86400000)), availableSpots: 3, maxRiders: 5, isActive: true },
    { tourId: adventureTour.id, startDate: formatDate(dates[4]), endDate: formatDate(new Date(dates[4].getTime() + 2 * 86400000)), availableSpots: 5, maxRiders: 5, isActive: true },
    { tourId: grandTour.id, startDate: formatDate(dates[1]), endDate: formatDate(new Date(dates[1].getTime() + 4 * 86400000)), availableSpots: 4, maxRiders: 5, isActive: true },
    { tourId: grandTour.id, startDate: formatDate(dates[5]), endDate: formatDate(new Date(dates[5].getTime() + 4 * 86400000)), availableSpots: 5, maxRiders: 5, isActive: true },
  ]);

  await db.insert(motorcyclesTable).values([
    {
      name: "CFMOTO 800MT Sport",
      brand: "CFMOTO",
      model: "800MT Sport",
      year: 2024,
      engineCC: 799,
      description: "Premium adventure touring motorcycle with a powerful parallel-twin engine. Perfect for long-distance touring with exceptional comfort and performance. Features full TFT dashboard, cruise control, and multiple riding modes.",
      specs: JSON.stringify({
        "Engine": "799cc Parallel-Twin, DOHC",
        "Power": "95 HP @ 8,750 rpm",
        "Torque": "80 Nm @ 6,500 rpm",
        "ABS": "Bosch 9.1M Cornering ABS",
        "Traction Control": "Yes, 3 modes",
        "Windshield": "Adjustable touring windshield",
        "Luggage": "Side panniers + top case (60L total)",
        "Heated Grips": "Yes, 5 levels",
        "Seat Height": "830mm (adjustable)",
        "Fuel Tank": "18L",
        "Weight": "218 kg"
      }),
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      isAvailable: true,
    },
    {
      name: "CFMOTO 800MT Explore",
      brand: "CFMOTO",
      model: "800MT Explore",
      year: 2023,
      engineCC: 799,
      description: "The adventure-ready variant of the 800MT, equipped with off-road tires, skid plate, and enhanced suspension for Moldova's varied terrain. Ideal for riders who want to explore forest tracks and unpaved village roads.",
      specs: JSON.stringify({
        "Engine": "799cc Parallel-Twin, DOHC",
        "Power": "90 HP @ 8,500 rpm",
        "Torque": "80 Nm @ 6,500 rpm",
        "ABS": "Bosch 9.1M with off-road mode",
        "Traction Control": "Yes, with off-road setting",
        "Windshield": "Tall adventure windshield",
        "Luggage": "Side panniers + tank bag (55L total)",
        "Heated Grips": "Yes, 3 levels",
        "Seat Height": "850mm",
        "Fuel Tank": "18L",
        "Weight": "220 kg"
      }),
      imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600",
      isAvailable: true,
    },
    {
      name: "CFMOTO 700CL-X Adventure",
      brand: "CFMOTO",
      model: "700CL-X Adventure",
      year: 2024,
      engineCC: 693,
      description: "A versatile adventure-touring motorcycle with a smooth 693cc engine. Great for beginners transitioning to larger adventure bikes, yet capable enough to satisfy experienced riders. Lightweight and easy to handle on winding Moldovan roads.",
      specs: JSON.stringify({
        "Engine": "693cc Parallel-Twin, DOHC",
        "Power": "70 HP @ 8,750 rpm",
        "Torque": "68 Nm @ 6,750 rpm",
        "ABS": "Bosch ABS",
        "Traction Control": "Yes",
        "Windshield": "Medium adventure windshield",
        "Luggage": "Side panniers (40L total)",
        "Heated Grips": "Yes",
        "Seat Height": "820mm",
        "Fuel Tank": "17L",
        "Weight": "196 kg"
      }),
      imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600",
      isAvailable: true,
    },
    {
      name: "BMW F 800 GS",
      brand: "BMW",
      model: "F 800 GS",
      year: 2022,
      engineCC: 798,
      description: "The legendary BMW GS adventure bike for riders who prefer a premium European machine. Known for its reliability, comfort over long distances, and iconic adventure touring heritage. Perfect for experienced riders.",
      specs: JSON.stringify({
        "Engine": "798cc Parallel-Twin, DOHC",
        "Power": "85 HP @ 7,500 rpm",
        "Torque": "83 Nm @ 5,750 rpm",
        "ABS": "BMW ABS Pro (cornering)",
        "Traction Control": "Yes + Hill Start Control",
        "Windshield": "Adjustable touring",
        "Luggage": "BMW Vario panniers + top case",
        "Heated Grips": "Yes (BMW standard)",
        "Seat Height": "845mm",
        "Fuel Tank": "16L",
        "Weight": "229 kg"
      }),
      imageUrl: "https://images.unsplash.com/photo-1547638375-ebcf64ab0d06?w=600",
      isAvailable: true,
    },
    {
      name: "Honda CB500X",
      brand: "Honda",
      model: "CB500X",
      year: 2023,
      engineCC: 471,
      description: "The perfect motorcycle for intermediate riders or those new to adventure touring. The CB500X's smaller engine and lighter weight make it ideal for beginners, while its fuel efficiency makes it economical on Moldova's long rural roads.",
      specs: JSON.stringify({
        "Engine": "471cc Parallel-Twin, DOHC",
        "Power": "47 HP @ 8,600 rpm",
        "Torque": "43 Nm @ 6,500 rpm",
        "ABS": "Honda ABS",
        "Traction Control": "No",
        "Windshield": "Adjustable",
        "Luggage": "Optional side bags",
        "Heated Grips": "Optional",
        "Seat Height": "830mm",
        "Fuel Tank": "17.7L",
        "Weight": "192 kg"
      }),
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      isAvailable: true,
    },
  ]);

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
