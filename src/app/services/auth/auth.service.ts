import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface AuthResult {
  success: boolean;
  message: string;
  user?: UserCredential['user'];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);

  constructor(private router: Router) { }

  register(email: string, password: string): Observable<AuthResult> {
    return from(createUserWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
      map(userCredential => {
        this.router.navigate(['/login']);
        return {
          success: true,
          message: "Registration successful! Please log in.",
          user: userCredential.user
        };
      }),
      catchError(error => {
        console.error("Registration failed:", error);
        return throwError(() => ({
          success: false,
          message: "Registration failed. Please try again."
        }));
      })
    );
  }

  login(email: string, password: string): Observable<AuthResult> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
      map(userCredential => {
        this.router.navigate(['/']);
        return {
          success: true,
          message: "Login successful! Welcome back.",
          user: userCredential.user
        };
      }),
      catchError(error => {
        console.error("Login failed:", error);
        this.router.navigate(['/signup']);
        return throwError(() => ({
          success: false,
          message: "Login failed. Please check your credentials and try again."
        }));
      })
    );
  }
}