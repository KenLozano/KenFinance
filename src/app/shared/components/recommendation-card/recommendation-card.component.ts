import {
  Component,
  Input,
} from '@angular/core';

export type RecommendationTone =
  | 'info'
  | 'warning'
  | 'danger'
  | 'success';

@Component({
  selector: 'app-recommendation-card',
  templateUrl: './recommendation-card.component.html',
  styleUrls: ['./recommendation-card.component.scss'],
  standalone: true,
})
export class RecommendationCardComponent {
  @Input() message = '';

  @Input()
  tone: RecommendationTone = 'info';
}