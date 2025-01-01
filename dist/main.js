"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors();
        app.useGlobalPipes(new common_1.ValidationPipe());
        app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
        await app.listen(process.env.PORT || 3000);
    }
    catch (error) {
        console.error("Error starting the server:", error);
    }
}
bootstrap().then(() => console.log(`Server running on http://localhost:${process.env.PORT || 3000}`));
//# sourceMappingURL=main.js.map