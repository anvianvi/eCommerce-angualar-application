import { Location } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../core/services/authentication.service';
import { GetCustomerService } from '../core/services/api/get-customer.service';
import { StorageService } from '../core/storage/storage.service';
import { SnackbarService } from '../core/services/mat-snackbar.service';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-user-profile',
  template: `<div>
    <h1>
      Here should be User Profile Page. It should display information about a
      user's profile.
    </h1>
    <p>{{ currentCustomer().email }}</p>
    <button (click)="goBack()">Back</button>
  </div>`,
  styles: ``,
})
export class ProfileComponent implements OnInit {
  isAuthenticated = computed(() => {
    return this.authenticationService.isAuthenticated();
  });

  currentCustomer = computed(() => {
    return this.storage.CurrentCustomer();
  });

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location,
    private getCustomerService: GetCustomerService,
    private storage: StorageService,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/']);
    }
    const currentCustomerId = localStorage.getItem('userId') || '';

    this.getCustomerService.queryCustomer(currentCustomerId).subscribe({
      next: () => {
        this.snackbarService.show(
          'Customer data fetched successfully',
          'Ok',
          2000,
        );
      },
      error: (err) => {
        this.snackbarService.show(
          `Failed to fetch Customer data, ${err}`,
          'Ok',
          2000,
        );
      },
    });

    console.log(this.currentCustomer());
  }

  goBack(): void {
    this.location.back();
  }
}
