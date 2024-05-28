import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header.component';
import { ObtainAccessTokenService } from './core/services/api/obtain-access-token';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private authService: ObtainAccessTokenService) {}

  ngOnInit(): void {
    this.authService.configureAccessToken();
  }
}
