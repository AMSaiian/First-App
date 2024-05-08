import {Component, Input, OnInit} from '@angular/core';
import { Card } from '../../../common/models/card';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() Card!: Card;
}
