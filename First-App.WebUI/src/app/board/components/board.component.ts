import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Board } from "../state/board.model";
import { Store } from "@ngrx/store";
import { BoardsFeature, BoardsState } from "../state/boards.state";
import { GroupList } from "../../group-list/state/group-list.model";
import { ActivatedRoute } from '@angular/router';
import { GroupListsFeature, GroupListsState } from "../../group-list/state/group-lists.state";
import { PaginationSizeService } from "../../common/services/pagination-size-service";
import { BoardsActions } from "../state/boards.actions";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  public board$! : Observable<Board>
  public groupLists$!: Observable<GroupList[]>

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly boardsStore: Store<BoardsState>,
              private readonly groupListsStore: Store<GroupListsState>,
              private readonly paginationService: PaginationSizeService
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.boardsStore.dispatch({ type: BoardsActions.apiGetBoardWithLists.type, payload: id })

    this.board$ = this.boardsStore
      .select(BoardsFeature.selectBoardById(Number(id))) as Observable<Board>;
    this.groupLists$ = this.groupListsStore
      .select(GroupListsFeature.selectGroupListsByBoardId(Number(id))) as Observable<GroupList[]>;
  }
}
