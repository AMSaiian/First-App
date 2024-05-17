import { Component, OnInit } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AsyncPipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { GroupListComponent } from "./group-list/components/group-list/group-list.component";
import { FilterPipe } from "./common/pipes/filter-pipe";
import { HttpClientModule } from "@angular/common/http";
import { GroupListService } from "./group-list/services/group-list-service";
import { Observable } from "rxjs";
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
import { FormsService } from "./common/services/forms-service";
import { FormGroup } from "@angular/forms";
import { BoardFormComponent } from "./board/components/board-form/board-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, AsyncPipe, GroupListComponent,
    FilterPipe, NgForOf, NgIf, HttpClientModule,
    MatGridListModule, NgClass, MatButtonModule,
    MatIconModule, GroupListFormComponent, MatMenu, MatMenuItem, RouterLink, RouterLinkActive, BoardFormComponent,
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
export class AppComponent implements OnInit {
  public boards$!: Observable<Board[]>;
  public createBoardForm!: FormGroup;
  public createBoardRequested = false;

  constructor(private readonly store: Store,
              private readonly formsService: FormsService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(PrioritiesActions.apiGetPriorities());
    this.store.dispatch(BoardsActions.apiGetBoards());

    this.boards$ = this.store.select(BoardsFeature.selectAll);
    this.createBoardForm = this.formsService.createBoardForm({});
  }

  public onCreateBoardRequested() {
    this.createBoardRequested = true;
  }

  public onCreateBoard() {
    this.store.dispatch(BoardsActions.apiAddBoard({
      board: {
        name: this.createBoardForm.value.name
      }
    }))
    this.createBoardForm.reset();
    this.createBoardRequested = false;
  }

  public onCancelCreateBoard() {
    this.createBoardForm.reset();
    this.createBoardRequested = false;
  }
}
