import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { UserRole } from "../../common/enums/roles.enum";
import { LocationRank } from "../../common/enums/location-rank.enum";

@Schema()
class Location {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: Object.values(LocationRank) })
  rank: LocationRank;

  @Prop({ required: true })
  address: string;
}

const LocationSchema = SchemaFactory.createForClass(Location);

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: Object.values(UserRole) })
  role: UserRole;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: false })
  phoneNumber?: string;

  @Prop({ type: LocationSchema, required: false })
  location?: Location;
}

export const UserSchema = SchemaFactory.createForClass(User);
