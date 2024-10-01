import { SignupComponent } from './components/auth/signup/signup.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';

export const routes: Routes = [
    {path:'', component:LoginComponent},
    {path:'login', component:LoginComponent},
    {path:'signup', component:SignupComponent},

];
