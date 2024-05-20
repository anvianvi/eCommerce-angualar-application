import { Routes } from '@angular/router';
import { MainComponent } from './shared/components/main.component';
import { RegistrationComponent } from './auth/components/registration/registration.componet';
import { NotFoundComponent } from './shared/components/404-page.component';
import { LoginComponent } from './auth/components/login.componet';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
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
  // {
  // path: 'catalog',
  // component: CatalogComponent,
  // },
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
