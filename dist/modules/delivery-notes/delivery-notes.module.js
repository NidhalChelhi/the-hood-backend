"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryNotesModule = void 0;
const common_1 = require("@nestjs/common");
const delivery_notes_service_1 = require("./delivery-notes.service");
const delivery_notes_controller_1 = require("./delivery-notes.controller");
const mongoose_1 = require("@nestjs/mongoose");
const delivery_note_schema_1 = require("./delivery-note.schema");
const user_schema_1 = require("../users/user.schema");
const order_schema_1 = require("../orders/order.schema");
let DeliveryNotesModule = class DeliveryNotesModule {
};
exports.DeliveryNotesModule = DeliveryNotesModule;
exports.DeliveryNotesModule = DeliveryNotesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: delivery_note_schema_1.DeliveryNote.name, schema: delivery_note_schema_1.DeliveryNoteSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
            ]),
        ],
        controllers: [delivery_notes_controller_1.DeliveryNotesController],
        providers: [delivery_notes_service_1.DeliveryNotesService],
        exports: [delivery_notes_service_1.DeliveryNotesService, mongoose_1.MongooseModule],
    })
], DeliveryNotesModule);
//# sourceMappingURL=delivery-notes.module.js.map