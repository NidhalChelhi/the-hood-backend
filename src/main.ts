import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(process.env.PORT || 3000);
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

bootstrap().then(() =>
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`)
);
