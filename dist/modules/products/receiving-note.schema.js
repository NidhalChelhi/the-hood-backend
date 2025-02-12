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
exports.ReceivingNoteSchema = exports.ReceivingNote = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ReceivingNote = class ReceivingNote extends mongoose_2.Document {
};
exports.ReceivingNote = ReceivingNote;
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                product: { type: mongoose_2.Types.ObjectId, ref: "Product", required: true },
                quantityAdded: { type: Number, required: true },
                purchasePrice: { type: Number, required: true },
                sellingPriceGold: { type: Number },
                sellingPriceSilver: { type: Number },
                sellingPriceBronze: { type: Number },
            },
        ],
        required: true,
    }),
    __metadata("design:type", Array)
], ReceivingNote.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Supplier" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ReceivingNote.prototype, "supplier", void 0);
exports.ReceivingNote = ReceivingNote = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ReceivingNote);
exports.ReceivingNoteSchema = mongoose_1.SchemaFactory.createForClass(ReceivingNote);
//# sourceMappingURL=receiving-note.schema.js.map