import { Location } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class ProfileComponent implements OnInit {
  isAuthenticated = computed(() => {
    return this.authenticationService.isAuthenticated();
  });

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location,
  ) {}

  // If user is not logged in, redirect to main page
  ngOnInit(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
