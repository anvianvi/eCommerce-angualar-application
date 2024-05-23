import { Component, OnInit, computed, signal } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CustomerResponse } from '../../shared/interfaces';
import { AuthService } from '../../shared/services/auth.service';
import { CustomValidatorsService } from '../../shared/services/custom-validators.service';
import {
  AuthCustomerService,
  CustomerRegestrationForm,
} from '../../shared/services/customer-auth.service';
import { FormatDataService } from '../../shared/services/format-date.service';
import { SnackbarService } from '../../shared/services/mat-snackbar.service';

@Component({
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  providers: [provideNativeDateAdapter()],
  standalone: true,
  selector: 'app-registration-page',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  useSameAddress = false;

  isAuthenticated = computed(() => {
    return this.authService.isAuthenticated();
  });

  registrationForm: FormGroup;
  submitInProcess = signal(false);
  hidepassword = true;

  countries = ['Poland', 'United States', 'Canada'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private customValidators: CustomValidatorsService,
    private FormatData: FormatDataService,
    private snackbarService: SnackbarService,
    private authCustomerService: AuthCustomerService,
  ) {
    this.registrationForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, this.customValidators.passwordValidator],
        ],
        confirmPassword: ['', [Validators.required]],
        firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
        lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
        dateOfBirth: [
          '',
          [
            Validators.required,
            this.customValidators.dateOfBirthValidator.bind(this),
          ],
        ],
        street: ['', [Validators.required]],
        city: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
        country: [
          '',
          [
            Validators.required,
            this.customValidators.countryValidator(this.countries),
          ],
        ],
        postalCode: [
          '',
          [Validators.required, this.customValidators.postalCodeValidator],
        ],
        useSameAddress: [true],
        shippingStreet: ['', [Validators.required]],
        shippingCity: [
          '',
          [Validators.required, Validators.pattern('[a-zA-Z]+')],
        ],
        shippingCountry: [
          '',
          [
            Validators.required,
            this.customValidators.countryValidator(this.countries),
          ],
        ],
        shippingPostalCode: [
          '',
          [Validators.required, this.customValidators.postalCodeValidator],
        ],
        setDefaultBilling: [false],
        setDefaultShipping: [false],
      },
      {
        validators: [
          this.customValidators.confirmPasswordValidator(
            'password',
            'confirmPassword',
          ),
        ],
      },
    );

    this.registrationForm
      .get('useSameAddress')
      ?.valueChanges.subscribe((useSameAddress) => {
        if (useSameAddress) {
          this.registrationForm.get('shippingStreet')?.disable();
          this.registrationForm.get('shippingCity')?.disable();
          this.registrationForm.get('shippingCountry')?.disable();
          this.registrationForm.get('shippingPostalCode')?.disable();
        } else {
          this.registrationForm.get('shippingStreet')?.enable();
          this.registrationForm.get('shippingCity')?.enable();
          this.registrationForm.get('shippingCountry')?.enable();
          this.registrationForm.get('shippingPostalCode')?.enable();
        }
      });
  }

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/main']);
    }
  }

  onSubmit() {
    const countryCode = this.FormatData.getCountyCode(
      this.registrationForm.get('country')?.value,
    );
    const formattedDateOfBirth = this.FormatData.getFormatedDateOfBirth(
      this.registrationForm.get('dateOfBirth')?.value,
    );

    const body: CustomerRegestrationForm = {
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password,
      firstName: this.registrationForm.value.firstName,
      lastName: this.registrationForm.value.lastName,
      dateOfBirth: formattedDateOfBirth,
      addresses: [
        {
          streetName: this.registrationForm.value.street,
          city: this.registrationForm.value.city,
          postalCode: this.registrationForm.value.postalCode,
          country: countryCode,
        },
      ],
    };

    console.log('submit triggered');
    console.log(body);
    this.authCustomerService.createCustomer(body).subscribe({
      next: (response: CustomerResponse) => {
        console.log('here is sucsses users regestration response');
        console.log(response);

        this.authCustomerService
          .customerLogin(body.email, body.password)
          .subscribe({
            next: (response: CustomerResponse) => {
              console.log('here is login response');
              console.log(response);

              if (response.customer.id) {
                this.authService.login(response.customer.id);
                this.router.navigate(['/main']);
                this.snackbarService.show(
                  'Successfully registered and logged in',
                  'Close',
                  3000,
                );
              }
            },
          });
      },
      error: (error: unknown) => {
        console.error(error);
      },
      complete: () => {
        console.log('Request complete');
      },
    });
  }
}
