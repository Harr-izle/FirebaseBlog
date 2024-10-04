import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, combineLatest, map, of } from 'rxjs';
import { IPost } from '../../models/post';
import { BlogpostService } from '../../services/blogpost/blogpost.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent  {
  user$: Observable<any>;
  userInfo: { key: string, value: string }[] = [];
  userPostsWithComments$: Observable<(IPost & { commentCount: number })[]>;

  constructor(
    private authService: AuthService,
    private blogService: BlogpostService,
    private router: Router
  ) {
    this.user$ = this.authService.getCurrentUser();
    this.userPostsWithComments$ = of([]);
  }

  ngOnInit() {
    this.user$.subscribe((user: { uid: string }) => {
      if (user) {
        this.userPostsWithComments$ = combineLatest([
          this.blogService.getPosts(),
          this.blogService.getAllComments()
        ]).pipe(
          map(([posts, comments]) => 
            posts
              .filter(post => post.authorId === user.uid)
              .map(post => ({
                ...post,
                commentCount: comments.filter(comment => comment.postId === post.id).length
              }))
          )
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