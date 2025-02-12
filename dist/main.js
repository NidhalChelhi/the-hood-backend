"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ["error", "warn", "log", "debug", "verbose"],
        });
        app.enableCors();
        app.use(cookieParser());
        app.useGlobalPipes(new common_1.ValidationPipe());
        app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
        await app.listen(process.env.PORT || 3000);
        console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
    }
    catch (error) {
        console.error("Error starting the server:", error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map