import { User } from "./user.schema";
export type UserInfo = Pick<User, "username" | "phoneNumber" | "location">;
