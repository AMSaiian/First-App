import { Component, Input } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { DatePipe, NgForOf } from "@angular/common";
import { MatChip } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule } from "@angular/forms";
import { MatIconButton } from "@angular/material/button";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { CardsState } from "../../state/cards.state";
import { Store } from "@ngrx/store";
import { CardsActions } from "../../state/cards.actions";
import { Card } from "../../state/card.model";
import { GroupListInfo } from "../../../group-list/state/group-list-info";
import { Priority } from "../../../priorities/state/priority.model";
import { MatDialog } from "@angular/material/dialog";
import { CardModalComponent } from "../card-modal/card-modal.component";
import { FormsService } from "../../../common/services/forms-service";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, MatIcon, DatePipe, MatChip, MatSelectModule, FormsModule, NgForOf, MatIconButton, MatMenu, MatMenuItem, MatMenuTrigger],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() card!: Card;
  @Input() priority!: Priority;
  @Input() anotherLists!: GroupListInfo[];

  constructor(private readonly cardsStore: Store<CardsState>,
              private readonly dialog: MatDialog,
              private readonly formsService: FormsService
  ) {}

  public onCardDeleted() {
    this.cardsStore.dispatch(CardsActions.apiDeleteCard({ cardId: this.card.id }))
  }

  public onChangedList(nextListId: number) {
    this.cardsStore.dispatch(CardsActions.apiUpdateCard({
      id: this.card.id,
      changes: {
        groupId: nextListId
      }
    }))
  }

  public onCardEdit() {
    const dialogRef = this.dialog.open(CardModalComponent, {
      height: '600px',
      width: '600px',
      data: {
        title: "Edit card",
        form: this.formsService.createCardForm(this.card)
      }
    })
      .afterClosed()
      .subscribe(data => {
        if (data !== undefined) {
          this.cardsStore.dispatch(CardsActions.apiUpdateCard({ id: this.card.id, changes: data }));
        }
      });
  }
}
