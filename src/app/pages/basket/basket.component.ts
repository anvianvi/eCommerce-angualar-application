import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../core/services/api/basket.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [MatButtonModule],
  template: `<button
      mat-flat-button
      color="primary"
      (click)="getMyActiveCart()"
    >
      get Cart
    </button>
    <button mat-flat-button color="primary" (click)="createmycart()">
      createmycart
    </button>`,
  styleUrl: './basket.component.scss',
})
export class BasketComponent implements OnInit {
  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    console.log('init');
  }

  getMyActiveCart(): void {
    console.log('test fetch');
    this.basketService.getMyActiveCart().subscribe({
      next: () => {},
      error: (err) => {
        console.log(err);
      },
    });
  }
  createmycart(): void {
    console.log('test fetch');
    this.basketService.createMyCart().subscribe({
      next: () => {},
      error: (err) => {
        console.log(err);
      },
    });
  }
}
