import { FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/**
 * Custom validator functions for reactive form validation
 */
// export class CustomValidators {
//   /**
//    * Validates that child controls in the form group are equal
//    */
//   static childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
//     const [firstControlName, ...otherControlNames] = Object.keys(
//       formGroup.controls || {},
//     );
//     const isValid = otherControlNames.every(
//       (controlName) =>
//         formGroup.get(controlName).value ===
//         formGroup.get(firstControlName).value,
//     );
//     return isValid ? null : { childrenNotEqual: true };
//   };
// }

export class CustomValidators {
  /**
   * Validates that child controls in the form group are equal
   */
  static childrenEqual: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) {
      return null; // Return null if the control is not a FormGroup
    }

    const formGroup = control as FormGroup;
    const controlNames = Object.keys(formGroup.controls);

    if (controlNames.length < 2) {
      return null; // Not enough controls to compare, consider valid
    }

    const [firstControlName, ...otherControlNames] = controlNames;
    const firstControlValue = formGroup.get(firstControlName)?.value;

    const allMatch = otherControlNames.every(
      (controlName) => formGroup.get(controlName)?.value === firstControlValue,
    );

    return allMatch ? null : { childrenNotEqual: true };
  };
}

/**
 * Custom ErrorStateMatcher which returns true (error exists) when the parent form group is invalid and the control has been touched
 */
export class ConfirmValidParentMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    // form: FormGroupDirective | NgForm | null,
  ): boolean {
    if (!control) {
      return false;
    }
    const parent = control.parent;
    return parent ? parent.invalid && control.touched : false;
  }
}

/**
 * Collection of reusable RegExps
 */
export const regExps: { [key: string]: RegExp } = {
  password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/,
};

/**
 * Collection of reusable error messages
 */
export const errorMessages: { [key: string]: string } = {
  fullName: 'Full name must be between 1 and 128 characters',
  email: 'Email must be a valid email address (username@domain)',
  password:
    'Password must be between 7 and 15 characters, and contain at least one number and special character',
  confirmPassword: 'Passwords must match',
};
