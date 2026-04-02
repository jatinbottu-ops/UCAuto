import nextEnv from "@next/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/ucautoconnect";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const demoUsers = [
  {
    email: "customer@example.com",
    firstName: "Demo",
    lastName: "Customer",
    role: "customer" as const,
    password: "Customer123!",
  },
  {
    email: "admin@example.com",
    firstName: "Demo",
    lastName: "Admin",
    role: "admin" as const,
    password: "Admin123!",
  },
];

const vehicles = [
  {
    slug: "2023-toyota-camry-se",
    make: "Toyota",
    model: "Camry SE",
    year: 2023,
    type: "sedan" as const,
    status: "available" as const,
    weeklyPrice: 30000,
    depositAmount: 50000,
    transmission: "automatic" as const,
    fuelType: "gas" as const,
    seats: 5,
    mpgCity: 28,
    mpgHighway: 39,
    mileagePolicy: "Unlimited mileage",
    minRentalDays: 7,
    features: ["Bluetooth", "Backup Camera", "Apple CarPlay", "Android Auto", "Lane Departure Warning", "Adaptive Cruise Control"],
    uberEligible: true,
    lyftEligible: true,
    deliveryEligible: false,
    isFeatured: true,
    description: "The 2023 Toyota Camry SE is the perfect rideshare vehicle — reliable, comfortable, and fuel-efficient. Passengers love the spacious interior and smooth ride.",
    images: ["https://upload.wikimedia.org/wikipedia/commons/0/07/Toyota_Camry_IX_front_quarter%2C_Guangzhou%2C_202311191645.jpg"],
  },
  {
    slug: "2022-honda-crv-hybrid",
    make: "Honda",
    model: "CR-V Hybrid",
    year: 2022,
    type: "suv" as const,
    status: "available" as const,
    weeklyPrice: 35000,
    depositAmount: 50000,
    transmission: "automatic" as const,
    fuelType: "hybrid" as const,
    seats: 5,
    mpgCity: 40,
    mpgHighway: 35,
    mileagePolicy: "Unlimited mileage",
    minRentalDays: 7,
    features: ["Honda Sensing", "Backup Camera", "Apple CarPlay", "Heated Seats", "Sunroof", "Wireless Charging"],
    uberEligible: true,
    lyftEligible: true,
    deliveryEligible: true,
    isFeatured: true,
    description: "The 2022 Honda CR-V Hybrid offers exceptional fuel economy and versatile cargo space. Perfect for rideshare and delivery.",
    images: ["https://upload.wikimedia.org/wikipedia/commons/f/f6/Honda_CR-V_Hybrid_Sport_%282023%29_%2853490165990%29.jpg"],
  },
  {
    slug: "2022-toyota-sienna-xle",
    make: "Toyota",
    model: "Sienna XLE",
    year: 2022,
    type: "minivan" as const,
    status: "limited" as const,
    weeklyPrice: 40000,
    depositAmount: 60000,
    transmission: "automatic" as const,
    fuelType: "hybrid" as const,
    seats: 8,
    mpgCity: 36,
    mpgHighway: 36,
    mileagePolicy: "Unlimited mileage",
    minRentalDays: 7,
    features: ["8-Passenger Capacity", "Dual Power Sliding Doors", "Backup Camera", "Apple CarPlay", "Stow-and-Go Seating", "Toyota Safety Sense"],
    uberEligible: true,
    lyftEligible: true,
    deliveryEligible: false,
    isFeatured: true,
    description: "The 2022 Toyota Sienna XLE Hybrid is perfect for XL rideshare. Earn more per trip with 8-passenger capacity.",
    images: ["https://upload.wikimedia.org/wikipedia/commons/e/e2/2022_Toyota_Sienna_XSE%2C_front_3.29.22.jpg"],
  },
  {
    slug: "2023-hyundai-elantra-sel",
    make: "Hyundai",
    model: "Elantra SEL",
    year: 2023,
    type: "sedan" as const,
    status: "available" as const,
    weeklyPrice: 25000,
    depositAmount: 40000,
    transmission: "automatic" as const,
    fuelType: "gas" as const,
    seats: 5,
    mpgCity: 33,
    mpgHighway: 43,
    mileagePolicy: "Unlimited mileage",
    minRentalDays: 7,
    features: ["Forward Collision-Avoidance", "Lane Keeping Assist", "Apple CarPlay", "Android Auto", "Backup Camera"],
    uberEligible: true,
    lyftEligible: true,
    deliveryEligible: false,
    isFeatured: false,
    description: "The 2023 Hyundai Elantra SEL is an affordable, fuel-efficient sedan ideal for rideshare drivers looking to maximize earnings.",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Hyundai_Elantra_2023_%28CN7%29_China.jpg/1280px-Hyundai_Elantra_2023_%28CN7%29_China.jpg"],
  },
  {
    slug: "2023-nissan-rogue-sv",
    make: "Nissan",
    model: "Rogue SV",
    year: 2023,
    type: "suv" as const,
    status: "available" as const,
    weeklyPrice: 32000,
    depositAmount: 50000,
    transmission: "automatic" as const,
    fuelType: "gas" as const,
    seats: 5,
    mpgCity: 30,
    mpgHighway: 37,
    mileagePolicy: "Unlimited mileage",
    minRentalDays: 7,
    features: ["ProPilot Assist", "Backup Camera", "Apple CarPlay", "Android Auto", "Dual-Zone Climate Control"],
    uberEligible: true,
    lyftEligible: false,
    deliveryEligible: true,
    isFeatured: false,
    description: "The 2023 Nissan Rogue SV offers great cargo capacity and a comfortable ride for delivery and rideshare.",
    images: ["https://upload.wikimedia.org/wikipedia/commons/4/41/2023_Nissan_Rogue_SV_in_Super_Black%2C_front_left.jpg"],
  },
  {
    slug: "2022-kia-sportage-lx",
    make: "Kia",
    model: "Sportage LX",
    year: 2022,
    type: "suv" as const,
    status: "waitlist" as const,
    weeklyPrice: 29000,
    depositAmount: 45000,
    transmission: "automatic" as const,
    fuelType: "gas" as const,
    seats: 5,
    mpgCity: 26,
    mpgHighway: 33,
    mileagePolicy: "Unlimited mileage",
    minRentalDays: 7,
    features: ["Forward Collision Warning", "Apple CarPlay", "Backup Camera", "Bluetooth"],
    uberEligible: true,
    lyftEligible: true,
    deliveryEligible: true,
    isFeatured: false,
    description: "The 2022 Kia Sportage LX is a reliable compact SUV great for all rideshare platforms.",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/2023_Kia_Sportage_LX_in_Gravity_Grey%2C_Front_Left%2C_05-22-2022.jpg/1280px-2023_Kia_Sportage_LX_in_Gravity_Grey%2C_Front_Left%2C_05-22-2022.jpg"],
  },
];

async function main() {
  console.log("Seeding database...");

  for (const demoUser of demoUsers) {
    await prisma.user.upsert({
      where: { email: demoUser.email },
      update: {
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        role: demoUser.role,
      },
      create: {
        email: demoUser.email,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        role: demoUser.role,
      },
    });
    console.log(`Seeded user: ${demoUser.email} (${demoUser.role})`);
  }

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { slug: vehicle.slug },
      update: vehicle,
      create: vehicle,
    });
    console.log(`Seeded: ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
