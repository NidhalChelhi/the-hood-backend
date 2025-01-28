import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Client extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: false })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true, unique: true, index: true })
  barCode: string;

  @Prop({ default: 0 })
  points: number;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

ClientSchema.pre("save", async function (next) {
  if (this.email) {
    const mailCheck = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email);
    if (!mailCheck) {
      throw new Error("invalid Email format");
    }
  }
  next();
});
