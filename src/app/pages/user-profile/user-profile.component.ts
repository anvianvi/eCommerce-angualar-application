import { Location } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SnackbarService } from '../../core/services/mat-snackbar.service';
import { GetCustomerService } from '../../core/services/api/get-customer.service';
import { StorageService } from '../../core/storage/storage.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  imports: [MatCardModule, MatButtonModule, MatExpansionModule],
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

  currentCustomer = computed(() => {
    return this.storage.CurrentCustomer();
  });
  // defaultShippingAddress = this.currentCustomer()?.addresses.find(
  //   (address) => address.id === this.currentCustomer()?.defaultShippingAddressId,
  // );
  // defaultBillingAddress = this.customerData?.addresses.find(
  //   (address) => address.id === this.customerData?.defaultBillingAddressId,
  // );

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location,
    private getCustomerService: GetCustomerService,
    private storage: StorageService,
    private snackbarService: SnackbarService,
  ) {}

  // If user is not logged in, redirect to main page
  ngOnInit(): void {
    console.log('App token', localStorage.getItem('AppAccessToken'));
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
