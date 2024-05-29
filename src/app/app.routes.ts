import { Routes } from '@angular/router';
import { MainComponent } from './pages/main.component';
import { NotFoundComponent } from './pages/404-page/404-page.component';
import { LoginComponent } from './pages/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { HeroComponent } from './pages/hero.component';

export const routes: Routes = [
  {
    path: '',
    component: HeroComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'main',
    component: MainComponent,
  },
  // {
  // path: 'profile',
  // component: ProfileComponent,
  // },
  // {
  // path: 'about',
  // component: AboutUsComponent,
  // },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
