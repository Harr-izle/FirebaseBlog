import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  form!: FormGroup;
  message: string = '';
  isError: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
    });
  }

  signUp(): void {
    if (this.form.valid) {
      this.authService.register(this.form.value.email, this.form.value.password)
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
