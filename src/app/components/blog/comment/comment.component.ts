import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError, Observable, of, tap } from 'rxjs';
import { IComment } from '../../../models/comment';
import { AuthService } from '../../../services/auth/auth.service';
import { BlogpostService } from '../../../services/blogpost/blogpost.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() postId!: string;
  comments$: Observable<IComment[]>;
  commentForm: FormGroup;
  currentUserId: string | null = null;

  constructor(
    private blogService: BlogpostService,
    private authService: AuthService,
    private fb: FormBuilder,
    
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
    this.comments$ = new Observable<IComment[]>();
  }

  ngOnInit() {
    this.comments$ = this.blogService.getCommentsForPost(this.postId);
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUserId = user ? user.uid : null;
    });
  }

  addComment() {
    if (this.commentForm.valid && this.currentUserId) {
      const newComment: Omit<IComment, 'id'> = {
        postId: this.postId,
        content: this.commentForm.value.content,
        authorId: this.currentUserId,
        authorName: 'Current User', // You might want to get the actual user name
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.blogService.addComment(newComment).pipe(
        tap(() => {
          this.commentForm.reset();
          // Refresh comments after adding
          this.comments$ = this.blogService.getCommentsForPost(this.postId);
        }),
        catchError(error => {
          console.error('Error adding comment:', error);
          return of(null);
        })
      ).subscribe();
    }
  }

  deleteComment(commentId: string | undefined) {
    if (commentId) {
      this.blogService.deleteComment(commentId).pipe(
        tap(() => {
          // Refresh comments after deleting
          this.comments$ = this.blogService.getCommentsForPost(this.postId);
        }),
        catchError(error => {
          console.error('Error deleting comment:', error);
          return of(null);
        })
      ).subscribe();
    }
  }

}
