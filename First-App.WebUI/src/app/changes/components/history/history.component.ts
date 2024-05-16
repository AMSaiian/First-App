import { Component, Inject, OnInit } from '@angular/core';
import { concatMap, Observable } from "rxjs";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { CardFormComponent } from "../../../card/components/card-form/card-form.component";
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { ChangeComponent } from "../change/change.component";
import { ChangesService } from "../../services/changes-service";
import { PaginationSizeService } from "../../../common/services/pagination-size-service";
import { HttpClientModule } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Change } from "../../state/change.model";
import { ChangesFeature, ChangesState } from "../../state/changes.state";
import { Store } from "@ngrx/store";
import { ChangesActions } from "../../state/changes.actions";

@Component({
  selector: 'app-history',
  standalone: true,
  providers: [
    ChangesService,
  ],
  imports: [
    AsyncPipe,
    CardFormComponent,
    MatDialogContent,
    MatDialogTitle,
    NgForOf,
    ChangeComponent,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})

export class HistoryComponent implements OnInit {
  public changes$!: Observable<Change[]>;
  public hasNextChanges$!: Observable<boolean>;

  constructor(@Inject(MAT_DIALOG_DATA) private data: { boardId: number },
              private readonly changesStore: Store<ChangesState>,
              private readonly paginationService: PaginationSizeService
  ) {}

  ngOnInit() {
    this.changesStore.dispatch(ChangesActions.resetChanges());
    this.changes$ = this.changesStore
      .select(ChangesFeature.selectCurrentPage)
      .pipe(
        concatMap(currentPageNum => {
          this.changesStore.dispatch(ChangesActions.apiGetBoardChanges({
            boardId: this.data.boardId,
            paginationContext: {
              pageNum: currentPageNum,
              pageSize: this.paginationService.getChangesInHistoryAmount()
            }
          }))

          return this.changesStore.select(ChangesFeature.selectAll);
        })
      )

    this.hasNextChanges$ = this.changesStore.select(ChangesFeature.selectHasNextChanges);
  }

  protected onNextChangesRequested() {
    this.changesStore.dispatch(ChangesActions.incrementPageNum());
  }
}
