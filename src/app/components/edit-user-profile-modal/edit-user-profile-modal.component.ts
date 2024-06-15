import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { SnackbarService } from '../../core/services/mat-snackbar.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Customer } from '../../core/models/customer';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomValidatorsService } from '../../core/services/custom-validators.service';
import { FormatDataService } from '../../core/services/format-date.service';
import { updateBody } from '../../core/services/api/get-customer.service';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { HttpHeaderService } from '../../core/services/api/http-headers.service';

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private customValidators: CustomValidatorsService,
    private formatData: FormatDataService,
    private snackbarService: SnackbarService,
    private headerService: HttpHeaderService,
    public dialogRef: MatDialogRef<EditUserProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer,
  ) {
    this.editUserProfileForm = this.fb.group({
      email: [data.email, [Validators.required, Validators.email]],
      firstName: [
        data.firstName,
        [Validators.required, Validators.pattern('[a-zA-Z]+')],
      ],
      lastName: [
        data.lastName,
        [Validators.required, Validators.pattern('[a-zA-Z]+')],
      ],
      dateOfBirth: [
        data.dateOfBirth,
        [
          Validators.required,
          this.customValidators.dateOfBirthValidator.bind(this),
        ],
      ],
    });
    this.editUserProfileForm.valueChanges.subscribe(() => {
      const emailControl = this.editUserProfileForm.get('email');
      const firstNameControl = this.editUserProfileForm.get('firstName');
      const lastNameControl = this.editUserProfileForm.get('lastName');
      const dateOfBirthControl = this.editUserProfileForm.get('dateOfBirth');
      if (
        (emailControl &&
          emailControl.dirty &&
          emailControl.value !== data?.email) ||
        (firstNameControl &&
          firstNameControl.dirty &&
          firstNameControl.value !== data?.firstName) ||
        (lastNameControl &&
          lastNameControl.dirty &&
          lastNameControl.value !== data?.lastName) ||
        (dateOfBirthControl &&
          dateOfBirthControl.dirty &&
          dateOfBirthControl.value !== data?.dateOfBirth)
      ) {
        this.isFormChanged = true;
      } else {
        this.isFormChanged = false;
      }
    });
  }

  createRequestBody(): updateBody {
    const newEmail = this.editUserProfileForm.value.email;
    const newFirstName = this.editUserProfileForm.value.firstName;
    const newLastName = this.editUserProfileForm.value.lastName;
    const newDateOfBirth = this.formatData.getFormattedDateOfBirth(
      this.editUserProfileForm.get('dateOfBirth')?.value,
    );
    const body: updateBody = {
      version: this.data.version,
      actions: [],
    };
    if (newEmail !== this.data.email) {
      body.actions.push({
        action: 'changeEmail',
        email: newEmail,
      });
    }
    if (newFirstName !== this.data.firstName) {
      body.actions.push({
        action: 'setFirstName',
        firstName: newFirstName,
      });
    }
    if (newLastName !== this.data.lastName) {
      body.actions.push({
        action: 'setLastName',
        lastName: newLastName,
      });
    }
    if (newDateOfBirth !== this.data.dateOfBirth) {
      body.actions.push({
        action: 'setDateOfBirth',
        dateOfBirth: newDateOfBirth,
      });
    }
    return body;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    const headers = this.headerService.getHeader();

    this.http
      .post<Customer>(
        `${this.apiUrl}/customers/${this.data.id}`,
        this.createRequestBody(),
        {
          headers,
        },
      )
      .subscribe(() => {
        this.snackbarService.show('Successfully updated data', 'Close', 3000);
        this.dialogRef.close(true);
      });
  }
}
