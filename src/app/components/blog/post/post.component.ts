
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { IPost } from '../../../models/post';
import { AuthService } from '../../../services/auth/auth.service';
import { BlogpostService } from '../../../services/blogpost/blogpost.service';
import { CommentComponent } from '../comment/comment.component';



@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule,CommentComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  post$: Observable<IPost | undefined>;
  currentUserId: string | null = null;
  isEditing = false;
  editForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogpostService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
    this.post$ = new Observable<IPost | undefined>();
  }

  ngOnInit() {
    this.post$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.blogService.getPost(id) : new Observable<undefined>();
      })
    );

    this.authService.getCurrentUser().subscribe(user => {
      this.currentUserId = user ? user.uid : null;
    });
  }

  startEdit() {
    this.isEditing = true;
    this.post$.subscribe(post => {
      if (post) {
        this.editForm.patchValue({
          title: post.title,
          content: post.content
        });
      }
    });
  }

  cancelEdit() {
    this.isEditing = false;
  }

  updatePost() {
    if (this.editForm.valid) {
      this.post$.subscribe(post => {
        if (post && post.id) {
          this.blogService.updatePost(post.id, this.editForm.value)
            .subscribe({
              next: () => {
                this.isEditing = false;
                // Refresh the post data
                this.post$ = this.blogService.getPost(post.id!);
              },
              error: (error: any) => console.error('Error updating post:', error)
            });
        }
      });
    }
  }

  deletePost() {
    this.post$.subscribe(post => {
      if (post && post.id) {
        this.blogService.deletePost(post.id)
          .subscribe({
            next: () => {
              this.router.navigate(['/']);
            },
            error: (error: any) => console.error('Error deleting post:', error)
          });
      }
    });
  }
}