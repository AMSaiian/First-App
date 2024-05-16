import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AsyncPipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { GroupListComponent } from "./group-list/components/group-list/group-list.component";
import { FilterPipe } from "./common/pipes/filter-pipe";
import { HttpClientModule } from "@angular/common/http";
import { GroupListService } from "./group-list/services/group-list-service";
import { Observable, Subject } from "rxjs";
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
import { Store } from "@ngrx/store";
import { BoardsFeature } from "./board/state/boards.state";
import { BoardsActions } from "./board/state/boards.actions";
import { PrioritiesActions } from "./priorities/state/priorities.actions";
import { Board } from "./board/state/board.model";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, AsyncPipe, GroupListComponent,
    FilterPipe, NgForOf, NgIf, HttpClientModule,
    MatGridListModule, NgClass, MatButtonModule,
    MatIconModule, GroupListFormComponent, MatMenu, MatMenuItem, RouterLink, RouterLinkActive,
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
  private unsubscribe$ = new Subject<void>;
  public boards$!: Observable<Board[]>

  constructor(private readonly store: Store,
              private readonly paginationService: PaginationSizeService,
              private readonly dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.store.dispatch(PrioritiesActions.apiGetPriorities());
    this.store.dispatch(BoardsActions.apiGetBoards());

    this.boards$ = this.store.select(BoardsFeature.selectAll);
  }
}
