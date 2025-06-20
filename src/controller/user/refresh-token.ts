import { Request } from "express";
import { UnauthorizedError } from "../../errors/user";
import { refreshTokenSchema } from "../../schemas/user/user";
import { RefreshTokenUseCase } from "../../use-cases/user/refresh-token";
import { badRequest, ok, serverError, unauthorized } from "../helpers/http";
import { ZodError } from "zod";
import { HttpRequest } from "../../types/httpRequest";

export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {
    this.refreshTokenUseCase = refreshTokenUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;

      await refreshTokenSchema.parseAsync(params);

      const result = await this.refreshTokenUseCase.execute(params);

      return ok(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.message);
      }
      if (error instanceof UnauthorizedError) {
        return unauthorized("Unauthorized");
      }
      console.error(error);
      return serverError();
    }
  }
}
