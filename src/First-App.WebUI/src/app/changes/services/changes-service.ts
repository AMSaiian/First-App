import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../../common/services/api-endpoints-service";
import {Change} from "../../common/models/change";
import {PaginationContext} from "../../common/dtos/pagination/pagination-context";
import {Paginated} from "../../common/dtos/pagination/paginated";

@Injectable({ providedIn: "root" })
export class ChangesService {
  private changesSubject = new BehaviorSubject<Change[]>([]);
  private hasNextChangesSubject = new BehaviorSubject<boolean>(true);

  public changes$: Observable<Change[]> = this.changesSubject.asObservable();
  public hasNextChanges$: Observable<boolean> = this.hasNextChangesSubject.asObservable();

  constructor(private http: HttpClient,
              private apiEndpoints: ApiEndpointsService) {
  }

  public getChanges(paginationContext: PaginationContext) {
    this.http.get<Paginated<Change>>(this.apiEndpoints.getChanges(), {
      params: {
        pageNum: paginationContext.pageNum,
        pageSize: paginationContext.pageSize
      }
    })
      .subscribe(data => {
        const previousState = this.changesSubject.value;
        this.changesSubject.next([...previousState, ...data.entities]);
        this.hasNextChangesSubject.next(data.pagedInfo.totalPages > paginationContext.pageNum);
      });
  }
}
