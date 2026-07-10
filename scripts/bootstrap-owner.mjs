import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const required = ["DATABASE_URL", "ADMIN_EMAIL", "ADMIN_PASSWORD"];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const prisma = new PrismaClient();

try {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL },
    update: {
      name: process.env.ADMIN_NAME || "Portfolio Owner",
      passwordHash,
      role: UserRole.OWNER,
    },
    create: {
      email: process.env.ADMIN_EMAIL,
      name: process.env.ADMIN_NAME || "Portfolio Owner",
      passwordHash,
      role: UserRole.OWNER,
    },
  });

  console.log(`Owner account ready for ${process.env.ADMIN_EMAIL}`);
} finally {
  await prisma.$disconnect();
}
