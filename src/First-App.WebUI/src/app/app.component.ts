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
import {PrioritiesService} from "./priorities/services/priorities-service";
import {Priority} from "./common/models/priority";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, AsyncPipe, GroupListComponent,
    FilterPipe, NgForOf, NgIf, HttpClientModule,
    MatGridListModule, NgClass, MatButtonModule,
    MatIconModule
  ],
  providers: [GroupListService, ApiEndpointsService, PrioritiesService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'First-App.WebUI';

  public cards$!: Observable<Card[]>;
  public groupLists$!: Observable<GroupList[]>;
  public priorities$!: Observable<Priority[]>

  constructor(private groupListService: GroupListService,
              private prioritiesService: PrioritiesService) {
  }

  ngOnInit(): void {
    this.groupListService.getInitGroupListsWithCards();
    this.prioritiesService.getPriorities();
    this.cards$ = this.groupListService.cards$;
    this.groupLists$ = this.groupListService.groupLists$;
    this.priorities$ = this.prioritiesService.priorities$;
  }

  public onButtonClick(): void {
    this.groupListService.getGroupListCards(1, { pageNum: 2, pageSize: 2 })
  }
}
