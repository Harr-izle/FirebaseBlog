import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, switchMap, tap } from 'rxjs';
import { IPost } from '../../../models/post';
import { AuthService } from '../../../services/auth/auth.service';
import { BlogpostService } from '../../../services/blogpost/blogpost.service';
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, CommentComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  private postSubject = new BehaviorSubject<IPost | undefined>(undefined);
  post$ = this.postSubject.asObservable();
  currentUserId: string | null = null;
  isEditing = false;
  editForm: FormGroup;
  private subscriptions: Subscription = new Subscription();

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
  }

  ngOnInit() {
    this.subscriptions.add(
      this.route.paramMap.pipe(
        switchMap(params => {
          const id = params.get('id');
          return id ? this.blogService.getPost(id) : new Observable<undefined>();
        }),
        tap(post => this.postSubject.next(post))
      ).subscribe()
    );

    this.subscriptions.add(
      this.authService.getCurrentUser().subscribe(user => {
        this.currentUserId = user ? user.uid : null;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  startEdit() {
    this.isEditing = true;
    const post = this.postSubject.getValue();
    if (post) {
      this.editForm.patchValue({
        title: post.title,
        content: post.content
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }

  updatePost(event?: Event) {
    if (event) {
      event.preventDefault(); // Prevent form submission if event is provided
    }
    if (this.editForm.valid) {
      const post = this.postSubject.getValue();
      if (post && post.id) {
        const updatedPost: IPost = {
          ...post,
          ...this.editForm.value
        };
        this.blogService.updatePost(post.id, this.editForm.value)
          .subscribe({
            next: () => {
              this.isEditing = false;
              this.postSubject.next(updatedPost);
            },
            error: (error: any) => {
              console.error('Error updating post:', error);
              // Optionally, you can show an error message to the user here
            }
          });
      }
    }
  }

  deletePost() {
    const post = this.postSubject.getValue();
    if (post && post.id) {
      this.blogService.deletePost(post.id)
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (error: any) => console.error('Error deleting post:', error)
        });
    }
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
