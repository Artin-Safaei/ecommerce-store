import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "artinsafai2007@gmail.com";

  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      role: "ADMIN",
    },
  });

  console.log(
    `Admin role assigned to ${user.email}`
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });