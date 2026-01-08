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
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form = this.fb.group({
    identifier: ['', [Validators.required, Validators.email]],
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

    this.authService.login(this.form.value as any).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.snackBar.open('Login successful', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Login failed', 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }
}
