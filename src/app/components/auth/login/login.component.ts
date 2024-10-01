import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form!: FormGroup;
  message: string = '';
  isError: boolean = false;
  showResetPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
    });
  }
//login with email and password
  login(): void {
    if (this.form.valid) {
      this.authService.login(this.form.value.email, this.form.value.password)
        .subscribe({
          next: (result) => {
            this.message = result.message;
            this.isError = !result.success;
            if (result.success) {
              this.form.reset();
            }
          },
          error: (error) => {
            this.message = error.message;
            this.isError = true;
          }
        });
    }
  }


  // google login
  googleSignIn(): void {
    this.authService.googleSignIn()
      .subscribe({
        next: (result) => {
          this.message = result.message;
          this.isError = !result.success;
        },
        error: (error) => {
          this.message = error.message;
          this.isError = true;
        }
      });
  }

  //forgot password
  forgotPassword(): void {
    this.showResetPassword = true;
  }

  resetPassword(): void {
    const email = this.form.get('email')?.value;
    if (email) {
      this.authService.forgotPassword(email)
        .subscribe({
          next: (result) => {
            this.message = result.message;
            this.isError = !result.success;
            this.showResetPassword = false;
          },
          error: (error) => {
            this.message = error.message;
            this.isError = true;
          }
        });
    } else {
      this.message = "Please enter your email address.";
      this.isError = true;
    }
  }


}
