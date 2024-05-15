import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AsyncPipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { GroupListComponent } from "./group-list/components/group-list/group-list.component";
import { FilterPipe } from "./common/pipes/filter-pipe";
import { HttpClientModule } from "@angular/common/http";
import { GroupListService } from "./group-list/services/group-list-service";
import { Observable, Subject, takeUntil } from "rxjs";
import { ApiEndpointsService } from "./common/services/api-endpoints-service";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { PrioritiesService } from "./priorities/services/priorities-service";
import { PaginationSizeService } from "./common/services/pagination-size-service";
import { GroupListFormComponent } from "./group-list/components/group-list-form/group-list-form.component";
import { MatMenu, MatMenuItem } from "@angular/material/menu";
import { ChangesService } from "./changes/services/changes-service";
import { ErrorsService } from "./common/services/errors-service";
import { GroupList } from "./group-list/state/group-list.model";
import { Store } from "@ngrx/store";
import { BoardsFeature } from "./board/state/boards.state";
import { BoardsActions } from "./board/state/boards.actions";
import { GroupListsFeature } from "./group-list/state/group-lists.state";
import { PrioritiesActions } from "./priorities/state/priorities.actions";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, AsyncPipe, GroupListComponent,
    FilterPipe, NgForOf, NgIf, HttpClientModule,
    MatGridListModule, NgClass, MatButtonModule,
    MatIconModule, GroupListFormComponent, MatMenu, MatMenuItem,
  ],
  providers: [
    GroupListService,
    ApiEndpointsService,
    PrioritiesService,
    PaginationSizeService,
    ChangesService,
    ErrorsService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'First-App.WebUI';

  public groupLists$!: Observable<GroupList[]>;
  public createListRequested = false;

  private unsubscribe$ = new Subject<void>;

  constructor(private readonly store: Store,
              private readonly paginationService: PaginationSizeService) {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.store.dispatch(PrioritiesActions.apiGetPriorities());
    this.store.dispatch(BoardsActions.apiGetBoardWithLists({
      boardId: 1,
      paginationContext: {
        pageNum: 1,
        pageSize: this.paginationService.getCardsInGroupListAmount()
      }
    }))
    this.groupLists$ = this.store.select(GroupListsFeature.selectGroupListsByBoardId(1));
  }

  protected onCreateListRequested() {
    this.createListRequested = true;
  }
}
