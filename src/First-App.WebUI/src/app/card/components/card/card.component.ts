import {Component, Input} from '@angular/core';
import { Card } from '../../../common/models/card';
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() card!: Card;
}