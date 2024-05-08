import {Component, OnInit} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {GroupListComponent} from "./group-list/components/group-list.component";
import {FilterPipe} from "./common/pipes/filter-pipe";
import {HttpClientModule} from "@angular/common/http";
import {GroupListService} from "./group-list/services/group-list-service";
import {Observable} from "rxjs";
import {Card} from "./common/models/card";
import {GroupList} from "./common/models/group-list";
import {ApiEndpointsService} from "./common/services/api-endpoints-service";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, AsyncPipe, GroupListComponent,
    FilterPipe, NgForOf, NgIf, HttpClientModule,
    MatGridListModule, NgClass, MatButtonModule,
    MatIconModule
  ],
  providers: [GroupListService, ApiEndpointsService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'First-App.WebUI';

  public Cards$!: Observable<Card[]>;
  public GroupLists$!: Observable<GroupList[]>;

  constructor(private groupListService: GroupListService) {
  }

  ngOnInit(): void {
    this.groupListService.getInitGroupListsWithCards();
    this.Cards$ = this.groupListService.cards$;
    this.GroupLists$ = this.groupListService.groupLists$;
  }

  public onButtonClick(): void {
    this.groupListService.getGroupListCards(1, { pageNum:2, pageSize: 2 })
  }
}
