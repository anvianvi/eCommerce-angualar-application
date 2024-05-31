import { Location } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CustomerInfoService } from '../../core/services/api/customer-info.service';
import { SnackbarService } from '../../core/services/mat-snackbar.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Customer } from '../../core/models/customer';

@Component({
  imports: [MatCardModule, MatButtonModule],
  standalone: true,
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class ProfileComponent implements OnInit {
  isAuthenticated = computed(() => {
    return this.authenticationService.isAuthenticated();
  });
  customerId = localStorage.getItem('userId');
  accesstoken = localStorage.getItem('AppAccessToken') || '';

  customerData: Customer | null = null;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location,
    private customerInfoService: CustomerInfoService,
    private snackbarService: SnackbarService,
  ) {}

  // If user is not logged in, redirect to main page
  ngOnInit(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/']);
    }
    this.customerInfoService.queryCustomer().subscribe({
      next: (data) => {
        this.customerData = data;
        console.log('Customer data:', this.customerData);
      },
      error: (err) => {
        this.snackbarService.show(
          `Failed to fetch customer data: ${err}`,
          'Close',
          2000,
        );
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
