import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable, Subject, merge, takeUntil } from 'rxjs';
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
export class RegistrationComponent implements OnInit, OnDestroy {
  minDate: Date;

  hidepassword = true;
  private destroy$ = new Subject<void>();
  countries = ['Poland', 'United States', 'Canada'];
  submitInProcess = signal(false);

  errorMessage = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  StrongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  registrationForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(this.StrongPasswordRegx),
    ]),
    confirmPassword: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(this.StrongPasswordRegx),
    ]),
    firstName: new FormControl<string>('', [
      Validators.required,
      Validators.pattern('[a-zA-Z]+'),
    ]),
    lastName: new FormControl<string>('', [
      Validators.required,
      Validators.pattern('[a-zA-Z]+'),
    ]),
    dateOfBirth: new FormControl<string>('', [
      Validators.required,
      this.dateOfBirthValidator.bind(this),
    ]),
    street: new FormControl<string>('', [Validators.required]),
    city: new FormControl<string>('', [
      Validators.required,
      Validators.pattern('[a-zA-Z]+'),
    ]),
    country: new FormControl<string>('', [
      Validators.required,
      this.countryValidator(this.countries),
    ]),
    postalCode: new FormControl<string>('', [
      Validators.required,
      this.postalCodeValidator,
    ]),
  });

  get passwordFormField() {
    return this.registrationForm.get('password');
  }

  constructor(private http: HttpClient) {
    this.minDate = this.calculateMinDate(13);
  }

  ngOnInit(): void {
    // this.minDate = this.calculateMinDate(13);

    const formControls = ['password', 'confirmPassword'];
    const formChanges: Observable<unknown>[] = formControls.flatMap(
      (controlName) => [
        this.registrationForm.get(controlName)
          ?.statusChanges as Observable<unknown>,
        this.registrationForm.get(controlName)
          ?.valueChanges as Observable<unknown>,
      ],
    );

    merge(...formChanges)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateErrorMessages());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateErrorMessages() {
    const passwordControl = this.registrationForm.get('password');
    const confirmPasswordControl = this.registrationForm.get('confirmPassword');

    if (this.passwordFormField?.dirty) {
      this.errorMessage.password = this.getPasswordRecommendation();
    }

    if (confirmPasswordControl?.hasError('required')) {
      this.errorMessage.confirmPassword = 'You must confirm your password';
    } else if (confirmPasswordControl?.value !== passwordControl?.value) {
      this.errorMessage.confirmPassword = 'Passwords do not match';
    }
  }

  getPasswordRecommendation(): string {
    const value = this.registrationForm.get('password')?.value || '';

    const hasLowerCase = /[a-z]/.test(value);
    if (!hasLowerCase) {
      return 'Password must include at least one lowercase letter';
    }

    const hasUpperCase = /[A-Z]/.test(value);
    if (!hasUpperCase) {
      return 'Password must include at least one uppercase letter';
    }

    const hasNumber = /\d/.test(value);
    if (!hasNumber) {
      return 'Password must include at least one digit';
    }

    const hasSpecialChar = /(?=.*\W)/.test(value);
    if (!hasSpecialChar) {
      return 'Password must include at least one special character (!@#?)';
    }

    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    return '';
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

  onSubmit() {
    const body = this.registrationForm.value;
    console.log('submit triggered');
    console.log(body);
    //   {
    //     "email": "example@email.com",
    //     "password": "user_password",
    //     "firstName": "John",
    //     "lastName": "Doe",
    //     "dateOfBirth": "1980-01-01",
    //     "addresses": [
    //         {
    //             "streetName": "Main Street",
    //             "city": "Anytown",
    //             "postalCode": "12345",
    //             "country": "US"
    //         }
    //     ]
    // }
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
