import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Card } from '../../../common/models/card';
import { MatCardModule } from "@angular/material/card";
import {Priority} from "../../../common/models/priority";
import {MatIcon} from "@angular/material/icon";
import {DatePipe, NgForOf} from "@angular/common";
import {MatChip} from "@angular/material/chips";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {GroupListInfo} from "../../../common/models/group-list-info";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

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
  @Output() cardUpdated = new EventEmitter<Partial<Card>>;
  @Output() cardDeleted = new EventEmitter<number>;
  @Output() editCardRequested = new EventEmitter<number>;

  public nextListId!: number;

  public onCardDeleted() {
    this.cardDeleted.emit(this.card.id);
  }

  public onCardEditRequested() {
    this.editCardRequested.emit(this.card.id);
  }

  public onChangedList() {
    this.cardUpdated.emit({ id: this.card.id, groupId: this.nextListId });
  }
}
