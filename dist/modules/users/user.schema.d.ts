import { Document } from "mongoose";
import { UserRole } from "../../common/enums/roles.enum";
import { LocationRank } from "../../common/enums/location-rank.enum";
declare class Location {
    name: string;
    rank: LocationRank;
    address: string;
}
export declare class User extends Document {
    username: string;
    password: string;
    role: UserRole;
    email?: string;
    phoneNumber?: string;
    location?: Location;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
