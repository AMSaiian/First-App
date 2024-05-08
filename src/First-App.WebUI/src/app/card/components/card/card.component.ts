import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Card } from '../../../common/models/card';
import { MatCardModule } from "@angular/material/card";
import {Priority} from "../../../common/models/priority";
import {MatIcon} from "@angular/material/icon";
import {DatePipe, NgForOf} from "@angular/common";
import {MatChip} from "@angular/material/chips";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, MatIcon, DatePipe, MatChip, MatSelectModule, FormsModule, NgForOf],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() card!: Card;
  @Input() priority!: Priority;
  @Input() anotherLists!: { listId: number, listName: string }[];
  @Output() changedList = new EventEmitter<[cardId: number, newPriorityId: number]>

  public nextListId!: number;

  public onChangedList() {
    this.changedList.emit([this.card.id, this.nextListId]);
  }
}
