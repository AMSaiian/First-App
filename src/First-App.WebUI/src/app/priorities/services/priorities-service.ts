import {Injectable} from "@angular/core";
import {BehaviorSubject, map, Observable} from "rxjs";
import {Priority} from "../../common/models/priority";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../../common/services/api-endpoints-service";

@Injectable({ providedIn: "root" })
export class PrioritiesService {
  private prioritiesSubject: BehaviorSubject<Priority[]> = new BehaviorSubject<Priority[]>([]);

  public priorities$: Observable<Priority[]> = this.prioritiesSubject.asObservable();

  constructor(private http: HttpClient, private apiEndpoints: ApiEndpointsService) {
  }

  public getPriorities() {
    this.http.get<Priority[]>(this.apiEndpoints.getPriorities())
      .subscribe(data => this.prioritiesSubject.next(data));
  }
}
