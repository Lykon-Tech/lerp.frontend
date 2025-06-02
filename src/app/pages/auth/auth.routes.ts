import { Routes } from '@angular/router';
import { Access } from './access';
import { LoginComponent } from './components/login/login.component';
import { Error } from './error';
import { SignUpComponent } from './components/sign-up/sign-up.component';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: LoginComponent },
    { path: 'signUp', component: SignUpComponent }
] as Routes;
