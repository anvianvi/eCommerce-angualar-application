import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ObtainAccessTokenService } from './core/services/api/obtain-access-token';
import { BasketService } from './core/services/api/basket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private obtainAccessTokenService: ObtainAccessTokenService,
    private basketService: BasketService,
  ) {}

  ngOnInit(): void {
    this.obtainAccessTokenService.getApplicationAccessToken();
    this.basketService.getBasket();
  }
}
