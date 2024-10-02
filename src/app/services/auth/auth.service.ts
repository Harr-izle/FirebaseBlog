import { inject, Injectable } from '@angular/core';
import { Auth, signOut, onAuthStateChanged, User, updateProfile, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from '@angular/fire/auth';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

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
  currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  storage: Storage = inject(Storage);

  constructor(private router: Router) { 
    onAuthStateChanged(this.firebaseAuth, (user) => {
      this.currentUserSubject.next(user);
    });

  }

 // Registration with confirm password
 register(email: string, password: string, confirmPassword: string): Observable<AuthResult> {
  // Check if passwords match
  if (password !== confirmPassword) {
    return throwError(() => ({
      success: false,
      message: "Passwords do not match."
    }));
  }

  return from(createUserWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
    map(userCredential => {
      this.router.navigate(['login']);
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

//login
  login(email: string, password: string): Observable<AuthResult> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
      map(userCredential => {
        this.router.navigate(['post-list']);
        return {
          success: true,
          message: "Login successful! Welcome back.",
          user: userCredential.user
        };
      }),
      catchError(error => {
        console.error("Login failed:", error);
        return throwError(() => ({
          success: false,
          message: "Login failed. Please check your credentials and try again."
        }));
      })
    );
  }


  //Sigin with googgle
  googleSignIn(): Observable<AuthResult> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.firebaseAuth, provider)).pipe(
      map(userCredential => {
        this.router.navigate(['post-list']);
        return {
          success: true,
          message: "Google sign-in successful! Welcome.",
          user: userCredential.user
        };
      }),
      catchError(error => {
        console.error("Google sign-in failed:", error);
        return throwError(() => ({
          success: false,
          message: "Google sign-in failed. Please try again."
        }));
      })
    );
  }

  //user profile
  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  logout(): Observable<void> {
    return from(signOut(this.firebaseAuth)).pipe(
      map(() => {
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error("Logout failed:", error);
        return throwError(() => ({
          success: false,
          message: "Logout failed. Please try again."
        }));
      })
    );
  }

  //forgot password
forgotPassword(email: string): Observable<AuthResult> {
  return from(sendPasswordResetEmail(this.firebaseAuth, email)).pipe(
    map(() => ({
      success: true,
      message: "Password reset email sent. Please check your inbox."
    })),
    catchError(error => {
      console.error("Password reset failed:", error);
      return throwError(() => ({
        success: false,
        message: "Failed to send password reset email. Please try again."
      }));
    })
  );
}

}

