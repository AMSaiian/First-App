import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatIcon} from "@angular/material/icon";
import { Priority } from "../../../priorities/state/priority.model";
import { GroupListInfo } from "../../../group-list/state/group-list-info";

@Component({
  selector: 'app-card-form',
  standalone: true,
  providers: [
    provideNativeDateAdapter()
  ],
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatFormFieldModule,
    MatInput,
    MatSelect,
    MatOption,
    NgForOf,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIcon,
    NgIf
  ],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.css'
})
export class CardFormComponent {
  @Input() form!: FormGroup;
  @Input() priorities!: Priority[];
  @Input() groupLists!: GroupListInfo[];
  @Output() saved = new EventEmitter();
  @Output() cancelled = new EventEmitter();

  protected onSaved() {
    if (this.form.valid) {
      this.saved.emit();
    }
  }

  protected onCancelEdit() {
    this.cancelled.emit();
  }

}
