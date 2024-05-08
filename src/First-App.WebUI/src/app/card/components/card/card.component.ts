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
  @Input() anotherLists!: GroupListInfo[];
  @Output() cardUpdated = new EventEmitter<Partial<Card>>;

  public nextListId!: number;

  public onChangedList() {
    this.cardUpdated.emit({ id: this.card.id, groupId: this.nextListId });
  }
}
