import { Component, OnInit } from '@angular/core';
import { Observable, switchMap, take } from "rxjs";
import { Board } from "../state/board.model";
import { Store } from "@ngrx/store";
import { BoardsFeature } from "../state/boards.state";
import { GroupList } from "../../group-list/state/group-list.model";
import { ActivatedRoute } from '@angular/router';
import { GroupListsFeature } from "../../group-list/state/group-lists.state";
import { PaginationSizeService } from "../../common/services/pagination-size-service";
import { BoardsActions } from "../state/boards.actions";
import { AsyncPipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { GroupListComponent } from "../../group-list/components/group-list/group-list.component";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { HistoryComponent } from "../../changes/components/history/history.component";
import { FormGroup } from "@angular/forms";
import { FormsService } from "../../common/services/forms-service";
import { GroupListsActions } from "../../group-list/state/group-lists.actions";
import { GroupListFormComponent } from "../../group-list/components/group-list-form/group-list-form.component";
import { B } from "@angular/cdk/keycodes";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    GroupListComponent,
    MatIcon,
    NgIf,
    MatButton,
    NgForOf,
    GroupListFormComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  public board$! : Observable<Board>
  public groupLists$!: Observable<GroupList[]>
  public createListRequested = false;
  public createListForm!: FormGroup;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly store: Store,
              private readonly paginationService: PaginationSizeService,
              private readonly formsService: FormsService,
              private readonly dialog: MatDialog,
  ) {
    this.createListForm = this.formsService.createGroupListForm({});
  }

  ngOnInit() {
    this.activatedRoute.params.pipe(
      switchMap(params => {
        const id = Number(params['id']);
        this.store.dispatch(BoardsActions.apiGetBoardWithLists({
          boardId: id,
          paginationContext: {
            pageNum: 1,
            pageSize: this.paginationService.getCardsInGroupListAmount()
          }
        }));
        this.board$ = this.store
          .select(BoardsFeature.selectBoardById(id)) as Observable<Board>;
        this.groupLists$ = this.store
          .select(GroupListsFeature.selectGroupListsByBoardId(id));
        return this.board$;
      })
    ).subscribe();
  }

  protected onViewHistory() {
    this.board$
      .pipe(
        take(1)
      ).subscribe((data) => {
        this.dialog.open(HistoryComponent, {
          data: {
            boardId: data.id
          },
          height: '100vh',
          width: '400px',
          position: { right: '0px' }
        })
    });
  }

  public onCreateListRequested() {
    this.createListRequested = true;
  }

  public onCreateList() {
    this.board$
      .pipe(
        take(1)
      ).subscribe((data) => {
        this.store.dispatch(GroupListsActions.apiAddList({
          groupList: {
            boardId: data.id,
            name: this.createListForm.value.name
          }
        }));

        this.createListForm.reset();
        this.createListRequested = false;
      })
  }

  public onCancelCreateList() {
    this.createListForm.reset();
    this.createListRequested = false;
  }

  protected readonly B = B;
}
