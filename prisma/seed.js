import { PrismaClient } from "../src/generated/prisma/index.js";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
async function seed() {
  console.info("Start Seeding...");
  for (let i = 0; i < 50; i++) {
    await prisma.todos.create({
      data: {
        title: faker.lorem.words(faker.number.int({ min: 4, max: 6 })),
        description: faker.lorem.sentence(
          faker.number.int({ min: 10, max: 20 })
        ),
        status: faker.helpers.arrayElement(["done", "pending"])
      }
    });
  }
}

seed()
  .then(() => {
    console.info("Seeding successfully!");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect();
  });
