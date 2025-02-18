import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RolesGuard } from "./roles.guard";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class AuthCompositeGuard implements CanActivate {
  private readonly logger = new Logger(AuthCompositeGuard.name);

  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly rolesGuard: RolesGuard,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const jwtValid = await this.jwtAuthGuard.canActivate(context);
    if (!jwtValid) return false;

    return this.rolesGuard.canActivate(context);
  }
}
