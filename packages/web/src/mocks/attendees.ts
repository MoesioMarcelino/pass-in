import { Attendee } from "../components";
import { faker } from "@faker-js/faker";

export const attendeeMockList: Attendee[] = Array.from({ length: 200 }).map(
  () => ({
    id: faker.number.int({ min: 10000, max: 20000 }).toString(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLocaleLowerCase(),
    createdAt: faker.date.recent({ days: 30 }).toString(),
    checkedInAt: faker.date.recent({ days: 7 }).toString(),
  })
);
