import { Component } from '@angular/core';
import {Router} from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user: any;
  userInfo: { key: string, value: string }[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.userInfo = [
          { key: 'UID', value: user.uid },
          { key: 'Email Verified', value: user.emailVerified ? 'Yes' : 'No' },
          { key: 'Account Created', value: user.metadata.creationTime || 'Unknown' },
          { key: 'Last Sign In', value: user.metadata.lastSignInTime || 'Unknown' }
        ];
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }

}
