import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import * as cookieParser from "cookie-parser";
// import { seedDatabase } from "./seeder";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ["error", "warn", "log", "debug", "verbose"],
    });
    app.enableCors();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());

    // await seedDatabase();

    await app.listen(process.env.PORT || 3000);
    console.log(
      `Server running on http://localhost:${process.env.PORT || 3000}`
    );
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

bootstrap();
