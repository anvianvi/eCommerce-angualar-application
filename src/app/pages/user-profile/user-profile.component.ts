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
import { MatDialog } from '@angular/material/dialog';
import { Address } from '../../core/models/customer';
import { EditUserProfileModalComponent } from '../../components/edit-user-profile-modal/edit-user-profile-modal.component';

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
    return this.storage.currentCustomer();
  });

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location,
    private getCustomerService: GetCustomerService,
    private storage: StorageService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
  ) {}

  get defaultShippingAddress(): Address | undefined {
    return this.currentCustomer().addresses.find(
      (address) =>
        address.id === this.currentCustomer().defaultShippingAddressId,
    );
  }

  get defaultBillingAddress(): Address | undefined {
    return this.currentCustomer().addresses.find(
      (address) =>
        address.id === this.currentCustomer().defaultBillingAddressId,
    );
  }

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
  }

  goBack(): void {
    this.location.back();
  }

  editBasicInfo(): void {
    this.dialog.open(EditUserProfileModalComponent, {
      width: '50vw',
      height: '70vh',
      data: this.currentCustomer(),
    });
  }
}
