
import { Routes } from '@angular/router';


export const routes: Routes = [
    
   {
    path: '',
    loadComponent: () => import('./components/auth/signup/signup.component').then(m => m.SignupComponent)
   },

   {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
   },

   {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
   },

];
