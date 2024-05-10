import {Component, Input} from '@angular/core';
import {Change} from "../../../common/models/change";
import {DatePipe, NgIf} from "@angular/common";
import {HistoryLogDirective} from "../../directives/history-log.directive";
import {locale} from "moment";

@Component({
  selector: 'app-change',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    HistoryLogDirective
  ],
  templateUrl: './change.component.html',
  styleUrl: './change.component.css'
})
export class ChangeComponent {
@Input() change!: Change;
  protected readonly locale = locale;
}
