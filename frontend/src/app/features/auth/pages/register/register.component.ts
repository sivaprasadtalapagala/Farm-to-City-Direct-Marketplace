import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.authService.register(this.form.value as any).subscribe({
      next: () => {
        this.snackBar.open('Registration successful. Please login.', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Registration failed', 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }
}
