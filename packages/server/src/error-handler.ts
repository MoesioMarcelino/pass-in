import { FastifyInstance } from "fastify";
import { BadRequest } from "./routes/_errors/bad-request";
import { NotFound } from "./routes/_errors/not-found";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, req, res) => {
  if (error instanceof ZodError) {
    return res.status(400).send({
      message: "Error during validation",
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof BadRequest) {
    return res.status(400).send({ message: error.message });
  }

  if (error instanceof NotFound) {
    return res.status(404).send({ message: error.message });
  }

  console.log("error", error);

  return res.status(500).send({ message: "Internal Serveeeer Error" });
};
