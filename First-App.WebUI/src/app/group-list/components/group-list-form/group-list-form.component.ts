import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInput } from "@angular/material/input";
import { NgClass, NgIf } from "@angular/common";

@Component({
  selector: 'app-group-list-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInput,
    NgIf,
    NgClass
  ],
  templateUrl: './group-list-form.component.html',
  styleUrl: './group-list-form.component.css'
})
export class GroupListFormComponent {
  @Input() form!: FormGroup;
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
