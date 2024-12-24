import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "../../common/decorators/public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(
      await this.authService.validateUser(body.username, body.password)
    );
  }
}
