import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getAttendeeProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/profile",
    {
      schema: {
        summary: "Get attendees profile data",
        tags: ["attendees"],
        params: z.object({
          attendeeId: z.string().transform(Number),
        }),
        response: {
          200: z.object({
            attendee: z.object({
              name: z.string(),
              email: z.string(),
              eventTitle: z.string(),
              checkInURL: z.string(),
            }),
          }),
        },
      },
    },
    async (req, res) => {
      const { attendeeId } = req.params;

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true,
            },
          },
        },
        where: {
          id: attendeeId,
        },
      });

      console.log("attendee", attendee);

      if (attendee === null) {
        throw new BadRequest("Attendee not found");
      }

      const { protocol, hostname } = req;
      const baseURL = `${protocol}://${hostname}`;
      const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL);

      return res.status(200).send({
        attendee: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInURL: checkInURL.toString(),
        },
      });
    }
  );
}
