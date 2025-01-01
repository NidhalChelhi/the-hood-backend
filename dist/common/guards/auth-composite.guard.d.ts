import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RolesGuard } from "./roles.guard";
export declare class AuthCompositeGuard implements CanActivate {
    private readonly jwtAuthGuard;
    private readonly rolesGuard;
    private readonly reflector;
    private readonly logger;
    constructor(jwtAuthGuard: JwtAuthGuard, rolesGuard: RolesGuard, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
