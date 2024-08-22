import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaDb = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prismaDb;

export default prismaDb;
