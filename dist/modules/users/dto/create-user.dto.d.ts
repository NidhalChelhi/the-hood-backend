declare class LocationDTO {
    name: string;
    rank: string;
    address: string;
}
export declare class CreateUserDTO {
    username: string;
    password: string;
    role: string;
    email?: string;
    phoneNumber?: string;
    location?: LocationDTO;
}
export {};
