import { Document } from "mongoose";
export declare class Client extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    barCode: string;
    points: number;
}
export declare const ClientSchema: import("mongoose").Schema<Client, import("mongoose").Model<Client, any, any, any, Document<unknown, any, Client> & Client & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Client, Document<unknown, {}, import("mongoose").FlatRecord<Client>> & import("mongoose").FlatRecord<Client> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
