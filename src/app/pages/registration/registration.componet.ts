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
    private CustomValidators: CustomValidatorsService,
    private FormatData: FormatDataService,
    private snackbarService: SnackbarService,
    private authCustomerService: AuthCustomerService,
  ) {
    this.registrationForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, this.CustomValidators.passwordValidator],
        ],
        confirmPassword: ['', [Validators.required]],
        firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
        lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
        dateOfBirth: [
          '',
          [
            Validators.required,
            this.CustomValidators.dateOfBirthValidator.bind(this),
          ],
        ],
        street: ['', [Validators.required]],
        city: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
        country: [
          '',
          [
            Validators.required,
            this.CustomValidators.countryValidator(this.countries),
          ],
        ],
        postalCode: [
          '',
          [Validators.required, this.CustomValidators.postalCodeValidator],
        ],
      },
      {
        validators: [
          this.CustomValidators.confirmPasswordValidator(
            'password',
            'confirmPassword',
          ),
        ],
      },
    );
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
                this.router.navigate(['/']);
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
