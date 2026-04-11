import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-confirm-submit-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslocoModule],
  template: `
    <h2 mat-dialog-title>{{ 'mentorEvaluation.confirmSubmitTitle' | transloco }}</h2>

    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">
        {{ 'common.cancel' | transloco }}
      </button>

      <button mat-raised-button color="primary" (click)="close(true)">
        {{ 'mentorEvaluation.actions.submit' | transloco }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmSubmitDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmSubmitDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as { message: string };

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}