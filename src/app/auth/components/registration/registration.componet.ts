import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
  AbstractControl,
  ValidationErrors,
  FormBuilder,
  ValidatorFn,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
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
export class RegistrationComponent {
  minDate: Date;
  registrationForm: FormGroup;
  hidepassword = true;
  countries = ['Poland', 'United States', 'Canada'];
  submitInProcess = signal(false);

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
  ) {
    this.minDate = this.calculateMinDate(13);

    this.registrationForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, this.passwordValidator]],
        confirmPassword: ['', [Validators.required]],
        firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
        lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
        dateOfBirth: [
          '',
          [Validators.required, this.dateOfBirthValidator.bind(this)],
        ],
        street: ['', [Validators.required]],
        city: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
        country: [
          '',
          [Validators.required, this.countryValidator(this.countries)],
        ],
        postalCode: ['', [Validators.required, this.postalCodeValidator]],
      },
      {
        validators: [
          this.confirmPasswordValidator('password', 'confirmPassword'),
        ],
      },
    );
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!/[a-z]/.test(value)) {
      return { noLowerCase: true };
    }

    if (!/[A-Z]/.test(value)) {
      return { noUpperCase: true };
    }

    if (!/\d/.test(value)) {
      return { noDigit: true };
    }

    if (!/(?=.*\W)/.test(value)) {
      return { noSimbol: true };
    }

    if (value.length < 8) {
      return { tooShort: true };
    }

    return null;
  }

  confirmPasswordValidator(
    controlName: string,
    checkControlName: string,
  ): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');
    if (
      passwordControl &&
      confirmPasswordControl &&
      passwordControl.value !== confirmPasswordControl.value
    ) {
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  postalCodeValidator(control: AbstractControl): ValidationErrors | null {
    const usRegex = /^\d{5}(-\d{4})?$/;
    const caRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
    const plRegex = /^\d{2}-\d{3}$/;
    const value = control.value;
    if (usRegex.test(value) || caRegex.test(value) || plRegex.test(value)) {
      return null;
    }

    return { invalidPostalCode: true };
  }

  countryValidator(
    allowedCountries: string[],
  ): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (allowedCountries.includes(control.value)) {
        return null;
      }
      return { invalidCountry: true };
    };
  }

  dateOfBirthValidator(
    control: FormControl,
  ): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    const minDate = new Date(this.minDate);
    if (selectedDate && selectedDate <= minDate && selectedDate < today) {
      return null;
    }
    return { invalidDateOfBirth: true };
  }

  calculateMinDate(minimumAge: number): Date {
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - minimumAge);
    return minDate;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  countryCodes: { [key: string]: string } = {
    Poland: 'PL',
    'United States': 'US',
    Canada: 'CA',
  };

  onSubmit() {
    const dateOfBirth = this.registrationForm.get('dateOfBirth')?.value;
    const formattedDateOfBirth = dateOfBirth
      ? this.formatDate(new Date(dateOfBirth))
      : '';

    const countryName = this.registrationForm.get('country')?.value;
    const countryCode = this.countryCodes[countryName];

    const body = {
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
    this.http
      .post(
        'https://api.europe-west1.gcp.commercetools.com/ecommerce-application-rsschool-1905/customers',
        body,
      )
      .subscribe(
        (response) => console.log(response),
        (error) => console.error(error),
      );
  }
}
