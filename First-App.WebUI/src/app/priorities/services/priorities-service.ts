import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiEndpointsService } from "../../common/services/api-endpoints-service";
import { Priority } from "../state/priority.model";

@Injectable({ providedIn: "root" })
export class PrioritiesService {

  constructor(private http: HttpClient,
              private apiEndpoints: ApiEndpointsService
  ) {}

  public getPriorities() {
    return this.http.get<Priority[]>(this.apiEndpoints.getPriorities());
  }
}
