import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog.component';
import { NotFoundComponent } from './pages/404-page.component';
import { LoginComponent } from './pages/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { DetailedProductInformationComponent } from './pages/detailed-product-information.component';
import { ProfileComponent } from './pages/user-profile/user-profile.component';

export const routes: Routes = [
  {
    path: '',
    component: CatalogComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  { path: 'product/:id', component: DetailedProductInformationComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
