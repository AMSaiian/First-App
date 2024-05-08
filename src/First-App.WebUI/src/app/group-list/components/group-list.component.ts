import {Component, EventEmitter, Input, Output} from '@angular/core';
import { NgForOf, SlicePipe } from "@angular/common";
import { CardComponent } from "../../card/components/card/card.component";
import {Card, compareCards} from "../../common/models/card";
import { GroupList } from '../../common/models/group-list';
import { Priority } from "../../common/models/priority";
import { FilterPipe } from "../../common/pipes/filter-pipe";
import {GroupListInfo} from "../../common/models/group-list-info";

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    NgForOf,
    CardComponent,
    FilterPipe,
    SlicePipe
  ],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css'
})
export class GroupListComponent {
  @Input() cards!: Card[];
  @Input() groupList!: GroupList;
  @Input() anotherLists!: GroupListInfo[]
  @Input() priorities!: Priority[];
  @Output() cardInListUpdated = new EventEmitter<Partial<Card>>;

  public onCardInListChanged($event: Partial<Card>) {
    this.cardInListUpdated.emit($event);
  }
}
