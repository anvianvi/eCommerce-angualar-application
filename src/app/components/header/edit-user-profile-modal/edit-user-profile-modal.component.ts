interface DialogData {
  customer: Customer;
  section: string;
}

import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { SnackbarService } from '../../../core/services/mat-snackbar.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Customer } from '../../../core/models/customer';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomValidatorsService } from '../../../core/services/custom-validators.service';
import { FormatDataService } from '../../../core/services/format-date.service';
import { updateBody } from '../../../core/services/api/get-customer.service';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-edit-user-profile-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButton,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-user-profile-modal.component.html',
  styleUrls: ['./edit-user-profile-modal.component.scss'],
})
export class EditUserProfileModalComponent {
  editUserProfileForm: FormGroup;
  isFormChanged = false;
  private apiUrl = `${environment.host}/${environment.project_key}`;
  private accessToken = localStorage.getItem('AppAccessToken') || '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private customValidators: CustomValidatorsService,
    private formatData: FormatDataService,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<EditUserProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.editUserProfileForm = this.fb.group({
      firstName: [
        data.customer.firstName,
        [Validators.required, Validators.pattern('[a-zA-Z]+')],
      ],
      lastName: [
        data.customer.lastName,
        [Validators.required, Validators.pattern('[a-zA-Z]+')],
      ],
      dateOfBirth: [
        data.customer.dateOfBirth,
        [
          Validators.required,
          this.customValidators.dateOfBirthValidator.bind(this),
        ],
      ],
    });
    // Disable save button if user didn't change value
    this.editUserProfileForm.valueChanges.subscribe(() => {
      const firstNameControl = this.editUserProfileForm.get('firstName');
      const lastNameControl = this.editUserProfileForm.get('lastName');
      const dateOfBirthControl = this.editUserProfileForm.get('dateOfBirth');
      if (
        (firstNameControl &&
          firstNameControl.dirty &&
          firstNameControl.value !== data?.customer.firstName) ||
        (lastNameControl &&
          lastNameControl.dirty &&
          lastNameControl.value !== data?.customer.lastName) ||
        (dateOfBirthControl &&
          dateOfBirthControl.dirty &&
          dateOfBirthControl.value !== data?.customer.dateOfBirth)
      ) {
        this.isFormChanged = true;
      } else {
        this.isFormChanged = false;
      }
    });
  }

  createRequestBody(): updateBody {
    const newFirstName = this.editUserProfileForm.value.firstName;
    const newLastName = this.editUserProfileForm.value.lastName;
    const newDateOfBirth = this.formatData.getFormattedDateOfBirth(
      this.editUserProfileForm.get('dateOfBirth')?.value,
    );
    const body: updateBody = {
      version: this.data.customer.version,
      actions: [],
    };
    if (newFirstName !== this.data.customer.firstName) {
      body.actions.push({
        action: 'setFirstName',
        firstName: newFirstName,
      });
    }
    if (newLastName !== this.data.customer.lastName) {
      body.actions.push({
        action: 'setLastName',
        lastName: newLastName,
      });
    }
    if (newDateOfBirth !== this.data.customer.dateOfBirth) {
      body.actions.push({
        action: 'setDateOfBirth',
        dateOfBirth: newDateOfBirth,
      });
    }
    return body;
  }

  onCancel(): void {
    // Reset the form to its initial state
    this.editUserProfileForm.reset({
      firstName: this.data?.customer.firstName || '',
      lastName: this.data?.customer.lastName || '',
      dateOfBirth: this.data?.customer.dateOfBirth || '',
    });
    this.isFormChanged = false;
    this.dialogRef.close();
  }

  onSave(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    this.http
      .post<Customer>(
        `${this.apiUrl}/customers/${this.data.customer.id}`,
        this.createRequestBody(),
        {
          headers,
        },
      )
      .subscribe(() => {
        this.snackbarService.show('Successfully updated data', 'Close', 3000);
        // Reload page
        window.location.reload();
      });
  }
}
