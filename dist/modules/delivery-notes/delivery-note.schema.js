"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryNoteSchema = exports.DeliveryNote = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const delivery_note_status_1 = require("../../common/enums/delivery-note-status");
let DeliveryNote = class DeliveryNote extends mongoose_2.Document {
};
exports.DeliveryNote = DeliveryNote;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Order", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DeliveryNote.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(delivery_note_status_1.DeliveryNoteStatus),
        default: delivery_note_status_1.DeliveryNoteStatus.PENDING,
    }),
    __metadata("design:type", String)
], DeliveryNote.prototype, "status", void 0);
exports.DeliveryNote = DeliveryNote = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DeliveryNote);
exports.DeliveryNoteSchema = mongoose_1.SchemaFactory.createForClass(DeliveryNote);
//# sourceMappingURL=delivery-note.schema.js.map