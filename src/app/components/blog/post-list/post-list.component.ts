import { Component, OnInit } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IPost } from '../../../models/post';
import { AuthService } from '../../../services/auth/auth.service';
import { BlogpostService } from '../../../services/blogpost/blogpost.service';
import { log } from 'console';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
 
  postsWithComments$!: Observable<(IPost & { commentCount: number })[]>;
  currentUserId: string | null = null;
  postForm: FormGroup;

  constructor(
    private blogService: BlogpostService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUserId = user ? user.uid : null;
    });

    this.postsWithComments$ = combineLatest([
      this.blogService.getPosts(),
      this.blogService.getAllComments()
    ]).pipe(
      map(([posts, comments]) => 
        posts.map(post => ({
          ...post,
          commentCount: comments.filter(comment => comment.postId === post.id).length
        }))
      )
    );
  }

  createPost() {
    if (this.postForm.valid && this.currentUserId) {
      const newPost: Omit<IPost, 'id'> = {
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        authorId: this.currentUserId,
        authorName: 'User', 
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.blogService.addPost(newPost).subscribe({
        next: () => {
          this.postForm.reset();
          // The posts$ observable will automatically update
        },
        error: (error) => console.error('Error creating post:', error)
      });
    }
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}