import cookieParser from "cookie-parser";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "@/app.module";

async function bootstrap() {
  const PORT: number = parseInt(process.env.PORT ?? "3000");

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin: ["http://localhost:3000", "http://localhost:5173", "https://react-auth-reactive.vercel.app"],
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
}

bootstrap();
