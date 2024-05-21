import { Injectable } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomValidatorsService {
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
    const minDateFor13ears = new Date();
    minDateFor13ears.setFullYear(minDateFor13ears.getFullYear() - 13);

    const selectedDate = new Date(control.value);
    const today = new Date();
    const minDate = new Date(minDateFor13ears);
    if (selectedDate && selectedDate <= minDate && selectedDate < today) {
      return null;
    }
    return { invalidDateOfBirth: true };
  }
}
