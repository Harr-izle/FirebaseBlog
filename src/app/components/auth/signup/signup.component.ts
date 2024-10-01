import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  form!: FormGroup;
  message: string = '';
  isError: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required]]  // Added confirm password field
    }, { validators: this.passwordMatchValidator });  // Custom validator for password matching
  }

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  signUp(): void {
    if (this.form.valid) {
      this.authService.register(this.form.value.email, this.form.value.password, this.form.value.confirmPassword)
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
}
