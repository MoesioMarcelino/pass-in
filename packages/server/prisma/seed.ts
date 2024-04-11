import { Prisma } from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

async function seed() {
  const eventId = "5b92b613-dc87-487e-843a-a2915353b5a6";

  await prisma.event.deleteMany();

  await prisma.event.create({
    data: {
      title: "Unite Summit",
      slug: "unite-summit",
      id: eventId,
      details: "A sample detail for an event",
      maximumAttendees: 100,
    },
  });

  const attendeesToInsert: Prisma.AttendeeUncheckedCreateInput[] = [];

  for (let i = 0; i <= 120; i++) {
    attendeesToInsert.push({
      id: 10000 + i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      eventId,
      createdAt: faker.date.recent({
        days: 30,
        refDate: dayjs().subtract(8, "days").toDate(),
      }),
      checkIn: faker.helpers.arrayElement<
        Prisma.CheckInUncheckedCreateNestedOneWithoutAttendeeInput | undefined
      >([
        undefined,
        {
          create: {
            createdAt: faker.date.recent({ days: 7 }),
          },
        },
      ]),
    });
  }

  await Promise.all(
    attendeesToInsert.map((data) => {
      return prisma.attendee.create({
        data,
      });
    })
  );
}

seed().then(() => {
  console.log("Database seeded!");
  prisma.$disconnect();
});
