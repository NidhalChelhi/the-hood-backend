"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabaseConnection = exports.connectToDatabase = void 0;
const mongoose_1 = require("mongoose");
const connectToDatabase = async (mongoUri) => {
    if (!mongoUri) {
        throw new Error("MONGO_URI is not set in the environment variables.");
    }
    await mongoose_1.default.connect(mongoUri);
    console.log("Connected to the database.");
};
exports.connectToDatabase = connectToDatabase;
const closeDatabaseConnection = () => {
    mongoose_1.default.disconnect();
    console.log("Disconnected from the database.");
};
exports.closeDatabaseConnection = closeDatabaseConnection;
//# sourceMappingURL=seeder-utils.js.map