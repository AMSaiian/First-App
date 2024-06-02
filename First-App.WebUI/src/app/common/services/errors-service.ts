import { Injectable } from "@angular/core";
import { HttpStatusCode } from "@angular/common/http";
import _ from "lodash";

@Injectable({ providedIn: "root" })
export class ErrorsService {
  humaniseError(error: ApiError): string {
    switch (error.statusCode) {
      case HttpStatusCode.Conflict:
        return [
          "Mentioned objects not found:",
          (error.errors as string[]).map(error => _.startCase(error))
        ].join("\n");
      case HttpStatusCode.UnprocessableEntity:
        return [
          "Error occured:",
          (error.errors as string[]).map(error => _.startCase(error))
        ].join("\n");
      case HttpStatusCode.BadRequest:
      case HttpStatusCode.InternalServerError:
      default:
        return "Something went wrong. Try later";
    }
  }
}

type ErrorDetails = {
  title: string,
  statusCode: number
}

export type ApiError = ErrorDetails &
  ({ errors: string[] } | { errors: Record<string, string> })

