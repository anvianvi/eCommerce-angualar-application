type changePasswordBody = {
  id: string;
  version: number;
  currentPassword: string;
  newPassword: string;
};

import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SnackbarService } from '../../core/services/mat-snackbar.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Customer } from '../../core/models/customer';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomValidatorsService } from '../../core/services/custom-validators.service';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { HttpHeaderService } from '../../core/services/api/http-headers.service';

@Component({
  selector: 'app-edit-password-modal',
  standalone: true,
  imports: [
    MatInputModule,
    MatDatepickerModule,
    MatButton,
    ReactiveFormsModule,
    MatIcon,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-password-modal.component.html',
  styleUrl: './edit-password-modal.component.scss',
})
export class EditPasswordModalComponent {
  editPasswordForm: FormGroup;
  isFormChanged = false;
  hideCurrentpassword = true;
  hideNewPassword = true;
  private apiUrl = `${environment.host}/${environment.project_key}`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private customValidators: CustomValidatorsService,
    private snackbarService: SnackbarService,
    private headerService: HttpHeaderService,
    public dialogRef: MatDialogRef<EditPasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer,
  ) {
    this.editPasswordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [Validators.required, this.customValidators.passwordValidator],
        ],
        confirmNewPassword: ['', [Validators.required]],
      },
      {
        validators: [
          this.customValidators.confirmPasswordValidator(
            'newPassword',
            'confirmNewPassword',
          ),
        ],
      },
    );
  }

  createRequestBody(): changePasswordBody {
    const currentPassword = this.editPasswordForm.value.currentPassword;
    const newPassword = this.editPasswordForm.value.newPassword;

    const body: changePasswordBody = {
      id: this.data.id,
      version: this.data.version,
      currentPassword: currentPassword,
      newPassword: newPassword,
    };
    return body;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const headers = this.headerService.getHeader();

    this.http
      .post<Customer>(
        `${this.apiUrl}/customers/password`,
        this.createRequestBody(),
        {
          headers,
        },
      )
      .subscribe(() => {
        this.snackbarService.show(
          'Successfully changed password',
          'Close',
          3000,
        );
        this.onCancel();
      });
  }
}
