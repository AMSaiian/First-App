import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {Change} from "../../../common/models/change";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {CardFormComponent} from "../../../card/components/card-form/card-form.component";
import {MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {ChangeComponent} from "../change/change.component";
import {ChangesService} from "../../services/changes-service";
import {PaginationSizeService} from "../../../common/services/pagination-size-service";
import {HttpClientModule} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

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

export class HistoryComponent {
  public changes$: Observable<Change[]>;
  public hasNextChanges$ : Observable<boolean>;
  private currentPage = 1;

  constructor(private changesService: ChangesService,
              private paginationService: PaginationSizeService) {
    this.changesService.getChanges({
      pageNum: this.currentPage,
      pageSize: paginationService.getChangesInHistoryAmount()
    });

    this.changes$ = changesService.changes$;
    this.hasNextChanges$ = changesService.hasNextChanges$;
  }

  protected onNextChangesRequested() {
    this.changesService.getChanges({
      pageNum: this.currentPage + 1,
      pageSize: this.paginationService.getChangesInHistoryAmount()
    });

    this.currentPage += 1;
  }
}
