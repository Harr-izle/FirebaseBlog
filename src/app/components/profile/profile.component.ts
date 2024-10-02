import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { Observable, map } from 'rxjs';
import { IPost } from '../../models/post';
import { BlogpostService } from '../../services/blogpost/blogpost.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user$: Observable<any>;
  userInfo: { key: string, value: string }[] = [];
  userPosts$: Observable<IPost[]>;

  constructor(
    private authService: AuthService,
    private blogService: BlogpostService,
    private router: Router
  ) {
    this.user$ = this.authService.getCurrentUser();
    this.userPosts$ = new Observable<IPost[]>();
  }

  ngOnInit() {
    this.user$.subscribe((user: { uid: string;  }) => {
      if (user) {
        this.userInfo = [
          { key: 'UID', value: user.uid },
         
        ];
        this.userPosts$ = this.blogService.getPosts().pipe(
          map((posts: any[]) => posts.filter((post: { authorId: any; }) => post.authorId === user.uid))
        );
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


