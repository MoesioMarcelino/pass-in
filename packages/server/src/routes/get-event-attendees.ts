import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { checkIn } from "./check-in";

export async function getEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Get attendees from an event",
        tags: ["events"],
        params: z.object({
          eventId: z.string(),
        }),
        querystring: z.object({
          query: z.string().nullish(),
          pageIndex: z.string().nullish().default("0").transform(Number),
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkedInAt: z.date().nullable(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (req, res) => {
      const { eventId } = req.params;
      const { pageIndex, query } = req.query;

      const [attendees, total] = await Promise.all([
        prisma.attendee.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            checkIn: {
              select: {
                createdAt: true,
              },
            },
          },
          where: {
            eventId,
            ...(query ? { name: { contains: query } } : {}),
          },
          take: 10,
          skip: pageIndex * 10,
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.attendee.count({
          where: {
            ...(query ? { eventId, name: { contains: query } } : { eventId }),
          },
        }),
      ]);

      return res.send({
        attendees: attendees.map(({ id, name, email, createdAt, checkIn }) => ({
          id,
          name,
          email,
          createdAt,
          checkedInAt: checkIn?.createdAt ?? null,
        })),
        total,
      });
    }
  );
}
