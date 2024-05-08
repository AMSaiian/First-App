import { Component, Input } from '@angular/core';
import { NgForOf, SlicePipe } from "@angular/common";
import { CardComponent } from "../../card/components/card/card.component";
import { Card } from "../../common/models/card";
import { GroupList } from '../../common/models/group-list';
import { Priority } from "../../common/models/priority";
import { FilterPipe } from "../../common/pipes/filter-pipe";

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
  @Input() priorities!: Priority[];
}
