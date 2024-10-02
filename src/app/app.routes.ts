import { Routes } from '@angular/router';
// import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/blog/post-list/post-list.component').then(m => m.PostListComponent)
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./components/blog/post/post.component').then(m => m.PostComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    // canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];