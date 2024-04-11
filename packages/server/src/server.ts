import fastity from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import {
  checkIn,
  createEvent,
  getAttendeeProfile,
  getEvent,
  registerForEvent,
  getEventAttendees,
} from "./routes";
import fastifyCors from "@fastify/cors";
import { errorHandler } from "./error-handler";

const app = fastity();
const port = 3333;

app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Pass.In",
      description: "Documentação da API do Pass.In",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeProfile);
app.register(checkIn);
app.register(getEventAttendees);

app.setErrorHandler(errorHandler);

app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`🚀️ HTTP server running on ${port} port`);
});
