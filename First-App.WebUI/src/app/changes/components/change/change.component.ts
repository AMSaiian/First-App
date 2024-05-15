import {Component, Input} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {HistoryLogDirective} from "../../directives/history-log.directive";
import {locale} from "moment";
import { Change } from "../../state/change.model";

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
